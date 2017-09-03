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
var memCache_1 = require("./memCache");
var AWS = require("aws-sdk");
var S3Helper = /** @class */ (function () {
    function S3Helper() {
        this.storage = new memCache_1["default"]();
        this.s3Client = new AWS.S3();
    }
    S3Helper.prototype.getRemoteFile = function (bucket, key) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var startTime = new Date();
                        _this.s3Client.getObject({
                            Bucket: bucket,
                            Key: key
                        }, function (err, data) {
                            if (err) {
                                console.error("S3 fetch error. version: " + key + ", error: " + err);
                                reject(err);
                            }
                            else {
                                console.log("Fetching " + bucket + "/" + key + " took " + (new Date().getTime() - startTime.getTime()));
                                resolve(data.Body.toString("utf8"));
                            }
                        });
                    })];
            });
        });
    };
    S3Helper.prototype.getFile = function (bucket, key, cacheOption) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var resultString;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!cacheOption) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.storage.fetch(key, cacheOption, function () { return _this.getRemoteFile(bucket, key); })];
                    case 1:
                        resultString = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.getRemoteFile(bucket, key)];
                    case 3:
                        // Doesn't Apply Cache
                        resultString = _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, resultString.replace("<html>", "<html date=" + new Date().toISOString() + ">")];
                }
            });
        });
    };
    return S3Helper;
}());
exports["default"] = S3Helper;
