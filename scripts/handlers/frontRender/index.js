"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fs = require("fs");
var config_1 = require("../../deploy/config");
var s3Helper_1 = require("../../helpers/s3Helper");
function handler(_event, _context) {
    return __awaiter(this, void 0, void 0, function () {
        var SOURCE_BUCKET, version, s3, tmpFilePath, resultHTML, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    SOURCE_BUCKET = config_1.AWS_S3_BUCKET;
                    version = fs.readFileSync("./version").toString();
                    s3 = new s3Helper_1["default"]();
                    tmpFilePath = "/tmp/" + version + ".html";
                    resultHTML = "";
                    if (!!fs.existsSync(tmpFilePath)) return [3 /*break*/, 6];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, s3.getRemoteFile(SOURCE_BUCKET, config_1.AWS_S3_FOLDER_PREFIX + "/" + version + "/index.html")];
                case 2:
                    resultHTML = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.error("Failed to get preview index.html file from s3: " + err_1);
                    return [3 /*break*/, 4];
                case 4: 
                // Write File
                return [4 /*yield*/, new Promise(function (resolve, reject) {
                        fs.writeFile(tmpFilePath, resultHTML, function (err) {
                            if (err) {
                                console.error("Failed writing a file: " + err);
                                reject(err);
                            }
                            else {
                                resolve();
                            }
                        });
                    })];
                case 5:
                    // Write File
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    try {
                        resultHTML = fs.readFileSync(tmpFilePath).toString("utf8");
                    }
                    catch (err) {
                        console.error("Failed to read file from cached tmp folder: " + err);
                    }
                    _a.label = 7;
                case 7: return [2 /*return*/, {
                        statusCode: 200,
                        headers: {
                            "Content-Type": "text/html"
                        },
                        body: resultHTML
                    }];
            }
        });
    });
}
exports["default"] = handler;
