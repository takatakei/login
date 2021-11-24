import {
  createIdRemapMiddleware,
  createStreamMiddleware,
  JRPCEngine,
  JRPCRequest,
  ObjectMultiplex,
  PostMessageStream,
  SafeEventEmitter,
  setupMultiplex,
  Stream,
} from "@toruslabs/openlogin-jrpc";
import { randomId } from "@toruslabs/openlogin-utils";
import pump from "pump";

export default class Provider extends SafeEventEmitter {
  iframeElem: HTMLIFrameElement | null = null;

  rpcStream: PostMessageStream;

  rpcEngine: JRPCEngine;

  initialized: boolean;

  mux: ObjectMultiplex;

  init({ iframeElem }: { iframeElem: HTMLIFrameElement }): void {
    this.iframeElem = iframeElem;
    this.setupStream();
    this.initialized = true;
  }

  setupStream(): void {
    if (this.iframeElem === null) throw new Error("iframe is null");
    this.rpcStream = new PostMessageStream({
      name: "embed_rpc",
      target: "iframe_rpc",
      targetWindow: this.iframeElem.contentWindow,
    });

    this.mux = setupMultiplex(this.rpcStream);

    const JRPCConnection = createStreamMiddleware();
    pump(
      JRPCConnection.stream as unknown as Stream,
      this.mux.createStream("jrpc") as unknown as Stream,
      JRPCConnection.stream as unknown as Stream,
      (error) => {
        window.console.log(`JRPC connection broken`, error);
      }
    );

    const rpcEngine = new JRPCEngine();
    rpcEngine.push(createIdRemapMiddleware());
    rpcEngine.push(JRPCConnection.middleware);
    this.rpcEngine = rpcEngine;
  }

  cleanup(): void {
    this.iframeElem = null;
    this.initialized = false;
  }

  _rpcRequest(payload: JRPCRequest<unknown>, callback: (...args: any[]) => void): void {
    if (!payload.jsonrpc) {
      payload.jsonrpc = "2.0";
    }
    if (!payload.id) {
      payload.id = randomId();
    }
    this.rpcEngine.handle(payload, callback);
  }
}