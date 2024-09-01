"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var path = require("path");
var url = require("url");
var bodyParser = require("body-parser");
var dotenv = require("dotenv");
var cors = require("cors");
var client_1 = require("./prisma-bazar/node_modules/@prisma/client");
var multer = require("multer");

var app = express();
var prisma = new client_1.PrismaClient();
app.use(cookieParser());
dotenv.config();
app.use(cors());
app.use(session({
    secret: 'dksj933iueddowd',
    resave: true,
    saveUninitialized: true,
    name: 'yourin'
}));
var secret = 'thisshouldbeasecret';
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var handleError = function (err, res) {
    res
        .status(500)
        .contentType("text/plain")
        .end("Oops! Something went wrong!");
};
var upload = multer({
    dest: "./view/upload"
});
var login = function (req, res, next) {
    // if(req.session?.profile&&req.cookies?.login) next()
    //   else res.json('خطای احراز هویت! لطفا دوباره تلاش کنید')
    next();
};
app.get('/', login, function (req, res) {
    res.sendFile(path.resolve(__dirname, "public", "main.html"));
});
app.get('/info', login, function (req, res) {
    res.sendFile(path.resolve(__dirname, "public", "info.html"));
});
app.get('/profile/editpage', login, function (req, res) {
    res.sendFile(path.resolve(__dirname, "public", "editprof.html"));
});
app.get('/profilepage', login, function (req, res) {
    res.sendFile(path.resolve(__dirname, "public", "profile.html"));
});
app.get('/productpage', login, function (req, res) {
    res.sendFile(path.resolve(__dirname, "public", "product.html"));
});
app.get('/product/editpagee', login, function (req, res) {
    res.sendFile(path.resolve(__dirname, 'public', 'edit.html'));
});
app.get('/deal/done', login, function (req, res) {
    res.sendFile(path.resolve(__dirname, 'public', 'donedeal.html'));
});
app.get('/user', login, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, deal, transaction_count, order_product, order_quantity, _i, deal_1, x, orders, sum, i, merchant_product, overall_rating, _a, merchant_product_1, x;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, prisma.merchant.findUnique({
                    where: {
                        id: 1
                    }
                })];
            case 1:
                user = _b.sent();
                if ((user === null || user === void 0 ? void 0 : user.id) && user) {
                    req.session.profile = user;
                    req.session.profileid = user.id;
                }
                return [4 /*yield*/, prisma.orders.findMany({
                        where: {
                            owner_id: req.session.profileid
                        }
                    })];
            case 2:
                deal = _b.sent();
                transaction_count = new Set();
                order_product = new Array();
                order_quantity = new Array();
                for (_i = 0, deal_1 = deal; _i < deal_1.length; _i++) {
                    x = deal_1[_i];
                    transaction_count.add(x.transaction_id);
                    order_product.push(x.product_id);
                    order_quantity.push(x.quantity);
                }
                return [4 /*yield*/, prisma.product.findMany({
                        where: {
                            id: { in: order_product }
                        }
                    })];
            case 3:
                orders = _b.sent();
                sum = 0;
                for (i = 0; i < orders.length; i++) {
                    sum += +(orders[i].price) * +(order_quantity[i]);
                }
                return [4 /*yield*/, prisma.product.findMany({
                        where: {
                            id: req.session.profileid
                        }
                    })];
            case 4:
                merchant_product = _b.sent();
                overall_rating = 0;
                for (_a = 0, merchant_product_1 = merchant_product; _a < merchant_product_1.length; _a++) {
                    x = merchant_product_1[_a];
                    if (x === null || x === void 0 ? void 0 : x.rating) {
                        overall_rating += +(x.rating);
                    }
                }
                req.session.save();
                res.json({
                    user: user,
                    trans_cou: transaction_count.size,
                    sum: sum,
                    rating: overall_rating
                });
                return [2 /*return*/];
        }
    });
}); });
app.post('/profile/edit', login, upload.single("image"), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, fullname, number, cartid, address, category, email, about, psw_new, psw_now, psw_repeat, edit, editpass, e_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, fullname = _a.fullname, number = _a.number, cartid = _a.cartid, address = _a.address, category = _a.category, email = _a.email, about = _a.about, psw_new = _a.psw_new, psw_now = _a.psw_now, psw_repeat = _a.psw_repeat;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 7, , 8]);
                if (!((_b = req.session.profile) === null || _b === void 0 ? void 0 : _b.password)) return [3 /*break*/, 6];
                if (!(psw_now == req.session.profile.password)) return [3 /*break*/, 5];
                return [4 /*yield*/, prisma.merchant.update({
                        where: {
                            id: req.session.profileid
                        },
                        data: {
                            name: fullname,
                            number: number,
                            card_id: cartid,
                            address: address,
                            category: category,
                            email: email,
                            about: about
                        }
                    })];
            case 2:
                edit = _c.sent();
                if (!(psw_new && psw_new == psw_repeat)) return [3 /*break*/, 4];
                return [4 /*yield*/, prisma.merchant.update({
                        where: {
                            id: req.session.profileid
                        },
                        data: {
                            password: psw_new
                        }
                    })];
            case 3:
                editpass = _c.sent();
                _c.label = 4;
            case 4:
                res.status(200).send();
                return [3 /*break*/, 6];
            case 5:
                res.status(390).send();
                _c.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                e_1 = _c.sent();
                res.status(305).send();
                console.log(e_1);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
app.get('/product', login, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var products;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.product.findMany({
                    where: {
                        owner_id: req.session.profileid
                    }
                })];
            case 1:
                products = _a.sent();
                res.json(products);
                return [2 /*return*/];
        }
    });
}); });

app.post("/product/add", upload.single("image"), login, function (req, res, err) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, price, quantity, weight, description, tags, title, detail, min, color, adddatabase, taglist, arr, _i, taglist_1, x, addtags, tables, i, addtable, colorlist, colors, _b, colorlist_1, j, addcolors, err_1;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 6, , 7]);
                _a = req.body, name_1 = _a.name, price = _a.price, quantity = _a.quantity, weight = _a.weight, description = _a.description, tags = _a.tags, title = _a.title, detail = _a.detail, min = _a.min, color = _a.color;
                if (!(((_c = req.session) === null || _c === void 0 ? void 0 : _c.profile) && ((_d = req.session) === null || _d === void 0 ? void 0 : _d.profileid))) return [3 /*break*/, 5];
                return [4 /*yield*/, prisma.product.create({
                        data: {
                            name: name_1,
                            owner_id: req.session.profileid,
                            price: price,
                            quantity: quantity,
                            weight: weight,
                            category: req.session.profile.category,
                            description: description,
                            min_amount: +min
                        }
                    })];
            case 1:
                adddatabase = _e.sent();
                taglist = tags.split(',');
                arr = [];
                for (_i = 0, taglist_1 = taglist; _i < taglist_1.length; _i++) {
                    x = taglist_1[_i];
                    arr.push({ product_id: adddatabase.id, tag: x });
                }
                return [4 /*yield*/, prisma.tags.createMany({
                        data: arr
                    })];
            case 2:
                addtags = _e.sent();
                tables = [];
                for (i = 0; i < detail.length; i++) {
                    tables.push({ product_id: adddatabase.id, title: title[i], detail: detail[i] });
                }
                return [4 /*yield*/, prisma.jadval.createMany({
                        data: tables
                    })];
            case 3:
                addtable = _e.sent();
                colorlist = color.split(',');
                colors = [];
                for (_b = 0, colorlist_1 = colorlist; _b < colorlist_1.length; _b++) {
                    j = colorlist_1[_b];
                    colors.push({ product_id: adddatabase.id, color: j });
                }
                return [4 /*yield*/, prisma.color.createMany({
                        data: colors
                    })];
            case 4:
                addcolors = _e.sent();
                _e.label = 5;
            case 5:
                res.status(200).send();
                return [3 /*break*/, 7];
            case 6:
                err_1 = _e.sent();
                console.log(err_1);
                res.status(400).send();
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
app.get('/product/delete', login, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var q, delet;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                q = url.parse(req.url, true).query;
                if (!(q === null || q === void 0 ? void 0 : q.id)) return [3 /*break*/, 2];
                return [4 /*yield*/, prisma.product.delete({
                        where: {
                            id: +q.id
                        }
                    })];
            case 1:
                delet = _a.sent();
                _a.label = 2;
            case 2:
                res.status(204).send();
                return [2 /*return*/];
        }
    });
}); });
app.get('/product/editpage', login, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var q, product, tags, color, jadval;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                q = url.parse(req.url, true).query;
                if (!(q === null || q === void 0 ? void 0 : q.id)) return [3 /*break*/, 5];
                return [4 /*yield*/, prisma.product.findUnique({
                        where: {
                            id: +q.id
                        }
                    })];
            case 1:
                product = _a.sent();
                return [4 /*yield*/, prisma.tags.findMany({
                        where: {
                            product_id: +q.id
                        }
                    })];
            case 2:
                tags = _a.sent();
                return [4 /*yield*/, prisma.color.findMany({
                        where: {
                            product_id: +q.id
                        }
                    })];
            case 3:
                color = _a.sent();
                return [4 /*yield*/, prisma.jadval.findMany({
                        where: {
                            product_id: +q.id
                        }
                    })];
            case 4:
                jadval = _a.sent();
                if (product === null || product === void 0 ? void 0 : product.name) {
                    res.json({
                        product: product,
                        tags: tags,
                        color: color,
                        jadval: jadval
                    });
                }
                else {
                    res.status(404).send();
                }
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); });
app.post('/product/edit', login, upload.single("image"), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var q, _a, name_2, price, quantity, weight, description, title, detail, min, editpro, arr, i, currentobj, previoustag, previoustagid_1, _i, previoustag_1, x, colors, i, currentobj, previouscolor, previouscolorid_1, _b, previouscolor_1, x, jadvalinput, i, currentobj, previoustable, previoustableid_1, _c, previoustable_1, x, error_1;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 6, , 7]);
                q = url.parse(req.url, true).query;
                _a = req.body, name_2 = _a.name, price = _a.price, quantity = _a.quantity, weight = _a.weight, description = _a.description, title = _a.title, detail = _a.detail, min = _a.min;
                if (!(((_d = req.session) === null || _d === void 0 ? void 0 : _d.profile) && ((_e = req.session) === null || _e === void 0 ? void 0 : _e.profileid) && (q === null || q === void 0 ? void 0 : q.id))) return [3 /*break*/, 5];
                return [4 /*yield*/, prisma.product.update({
                        where: {
                            id: +q.id
                        },
                        data: {
                            name: name_2,
                            owner_id: req.session.profileid,
                            price: price,
                            quantity: quantity,
                            weight: weight,
                            category: req.session.profile.category,
                            description: description,
                            min_amount: +min
                        }
                    })];
            case 1:
                editpro = _f.sent();
                arr = [];
                for (i = 0; i < 3; i++) {
                    if (req.body["taginfo".concat(i + 1)]) {
                        currentobj = JSON.parse(req.body["taginfo".concat(i + 1)]);
                        arr.push({ product_id: editpro.id, tag: currentobj.tag, id: +currentobj.id });
                    }
                    else {
                        break;
                    }
                }
                return [4 /*yield*/, prisma.tags.findMany({
                        where: {
                            product_id: +q.id
                        }
                    })];
            case 2:
                previoustag = _f.sent();
                previoustagid_1 = [];
                for (_i = 0, previoustag_1 = previoustag; _i < previoustag_1.length; _i++) {
                    x = previoustag_1[_i];
                    previoustagid_1.push(x.id);
                }
                arr.forEach(function (item, index) { return __awaiter(void 0, void 0, void 0, function () {
                    var updatetag;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!item.id) {
                                    item.id = 0;
                                }
                                previoustagid_1.forEach(function (x, index) {
                                    if (x == item.id)
                                        previoustagid_1.splice(index, 1);
                                });
                                return [4 /*yield*/, prisma.tags.upsert({
                                        where: { id: item.id },
                                        update: {
                                            product_id: item.product_id,
                                            tag: item.tag
                                        },
                                        create: {
                                            product_id: item.product_id,
                                            tag: item.tag
                                        }
                                    })];
                            case 1:
                                updatetag = _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                previoustagid_1.forEach(function (y, index) { return __awaiter(void 0, void 0, void 0, function () {
                    var deletag;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, prisma.tags.delete({
                                    where: {
                                        id: y
                                    }
                                })];
                            case 1:
                                deletag = _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                colors = [];
                for (i = 0; i < 8; i++) {
                    if (req.body["colinfo".concat(i + 1)]) {
                        currentobj = JSON.parse(req.body["colinfo".concat(i + 1)]);
                        colors.push({ product_id: editpro.id, color: currentobj.color, id: +currentobj.id });
                    }
                    else {
                        break;
                    }
                }
                return [4 /*yield*/, prisma.color.findMany({
                        where: {
                            product_id: +q.id
                        }
                    })];
            case 3:
                previouscolor = _f.sent();
                previouscolorid_1 = [];
                for (_b = 0, previouscolor_1 = previouscolor; _b < previouscolor_1.length; _b++) {
                    x = previouscolor_1[_b];
                    previouscolorid_1.push(x.id);
                }
                colors.forEach(function (item, index) { return __awaiter(void 0, void 0, void 0, function () {
                    var updatecolor;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!item.id) {
                                    item.id = 0;
                                }
                                previouscolorid_1.forEach(function (x, index) {
                                    if (x == item.id)
                                        previouscolorid_1.splice(index, 1);
                                });
                                return [4 /*yield*/, prisma.color.upsert({
                                        where: { id: item.id },
                                        update: {
                                            product_id: item.product_id,
                                            color: item.color
                                        },
                                        create: {
                                            product_id: item.product_id,
                                            color: item.color
                                        }
                                    })];
                            case 1:
                                updatecolor = _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                previouscolorid_1.forEach(function (y, index) { return __awaiter(void 0, void 0, void 0, function () {
                    var deletcol;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, prisma.color.delete({
                                    where: {
                                        id: y
                                    }
                                })];
                            case 1:
                                deletcol = _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                jadvalinput = [];
                for (i = 0; i < 12; i++) {
                    if (req.body["tableinfo".concat(i + 1)]) {
                        currentobj = JSON.parse(req.body["tableinfo".concat(i + 1)]);
                        console.log(currentobj);
                        jadvalinput.push({ product_id: editpro.id, title: currentobj.title, detail: currentobj.detail, id: +currentobj.id });
                    }
                    else {
                        break;
                    }
                }
                return [4 /*yield*/, prisma.jadval.findMany({
                        where: {
                            product_id: +q.id
                        }
                    })];
            case 4:
                previoustable = _f.sent();
                previoustableid_1 = [];
                for (_c = 0, previoustable_1 = previoustable; _c < previoustable_1.length; _c++) {
                    x = previoustable_1[_c];
                    previoustableid_1.push(x.id);
                }
                jadvalinput.forEach(function (item, index) { return __awaiter(void 0, void 0, void 0, function () {
                    var updatetable;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                previoustableid_1.forEach(function (x, index) {
                                    if (x == item.id)
                                        previoustableid_1.splice(index, 1);
                                });
                                if (!item.id) {
                                    item.id = 0;
                                }
                                if (!(item.detail !== '' && item.title !== '')) return [3 /*break*/, 2];
                                return [4 /*yield*/, prisma.jadval.upsert({
                                        where: { id: item.id },
                                        update: {
                                            product_id: item.product_id,
                                            title: item.title,
                                            detail: item.detail
                                        },
                                        create: {
                                            product_id: item.product_id,
                                            title: item.title,
                                            detail: item.detail
                                        }
                                    })];
                            case 1:
                                updatetable = _a.sent();
                                console.log(updatetable);
                                return [3 /*break*/, 3];
                            case 2:
                                previoustableid_1.push(item.id);
                                _a.label = 3;
                            case 3:
                                console.log(previoustableid_1);
                                return [2 /*return*/];
                        }
                    });
                }); });
                console.log(previoustableid_1);
                previoustableid_1.forEach(function (y, index) { return __awaiter(void 0, void 0, void 0, function () {
                    var deletable;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, prisma.jadval.delete({
                                    where: {
                                        id: y
                                    }
                                })];
                            case 1:
                                deletable = _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                res.status(200).send();
                _f.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_1 = _f.sent();
                console.log(error_1);
                res.status(400).send();
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
app.get('/done/deals', login, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var doneorders, result, _i, doneorders_1, x, donetrans, product;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.profileid)) return [3 /*break*/, 7];
                return [4 /*yield*/, prisma.orders.findMany({
                        where: {
                            owner_id: req.session.profileid
                        }
                    })];
            case 1:
                doneorders = _b.sent();
                result = [];
                _i = 0, doneorders_1 = doneorders;
                _b.label = 2;
            case 2:
                if (!(_i < doneorders_1.length)) return [3 /*break*/, 6];
                x = doneorders_1[_i];
                return [4 /*yield*/, prisma.transaction.findUnique({
                        where: {
                            id: x.transaction_id,
                            sent: true,
                            paid: true
                        }
                    })];
            case 3:
                donetrans = _b.sent();
                return [4 /*yield*/, prisma.product.findUnique({
                        where: {
                            id: x.product_id
                        }
                    })];
            case 4:
                product = _b.sent();
                if ((donetrans === null || donetrans === void 0 ? void 0 : donetrans.id) && (product === null || product === void 0 ? void 0 : product.id)) {
                    result.push({
                        description: x.description,
                        color: x.color,
                        product_name: product.name,
                        product_id: product.id,
                        quantity: x.quantity,
                        transactionid: x.transaction_id,
                        customer_address: x.address,
                        customer_postcode: x.post_code,
                        buytime: donetrans.time,
                        whole_money: ((+product.price) * (x.quantity)),
                        your_amount: ((+product.price) * (x.quantity)) * 0.97,
                        recieve: donetrans.recieve,
                        deposit: x.deposit_merchant
                    });
                }
                else {
                }
                _b.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 2];
            case 6:
                res.json(result);
                _b.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); });
app.listen(8000);
