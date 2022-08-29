// export default null;
class Loader {
  _wasm: typeof import("@emurgo/cardano-serialization-lib-asmjs") | undefined;

  async load() {
    if (this._wasm) return;
    /**
     * @private
     */
    this._wasm = await import("@emurgo/cardano-serialization-lib-asmjs");
  }

  get Cardano() {
    return this._wasm;
  }
}

export default new Loader();
