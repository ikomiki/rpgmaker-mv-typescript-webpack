/// <reference types="rpgmakermv_typescript_dts" />

import { MyPlugin } from "./myPlugin";

declare global {
    interface Game_Interpreter {
        myPlugin1: MyPlugin;
    }
}

const _Game_Interpreter_initialize = Game_Interpreter.prototype.initialize;

Game_Interpreter.prototype.initialize = function (
    this: Game_Interpreter,
    depth: number,
): void {
    _Game_Interpreter_initialize.call(this, depth);
    this.myPlugin1 = new MyPlugin();
};
