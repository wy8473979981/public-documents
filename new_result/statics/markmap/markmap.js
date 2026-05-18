/*! For license information please see markmap.js.LICENSE.txt */
!function(e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t(require("d3")) : "function" == typeof define && define.amd ? define(["d3"], t) : "object" == typeof exports ? exports.markmap = t(require("d3")) : e.markmap = t(e.d3)
}(this, e => {
    return t = {
        4764(e, t, r) {
            r(3893),
            r(2781);
            const n = r(7949)
              , s = r(3086)
              , i = r(5701);
            e.exports = {
                Markmap: n,
                parse: s,
                transform: i,
                create: function(e, t, r) {
                    const o = i(s(t));
                    return n(e, o, r)
                }
            }
        },
        460(e, t) {
            var r, n;
            r = function() {
                var e, t, r, n, s, i, o, a, l, c = function(e) {
                    e = e || {},
                    this.version = c.version,
                    this.urls = this.normalizeUrlsCfg(e.urls),
                    this.email = "boolean" != typeof e.email || e.email,
                    this.twitter = "boolean" != typeof e.twitter || e.twitter,
                    this.phone = "boolean" != typeof e.phone || e.phone,
                    this.hashtag = e.hashtag || !1,
                    this.newWindow = "boolean" != typeof e.newWindow || e.newWindow,
                    this.stripPrefix = "boolean" != typeof e.stripPrefix || e.stripPrefix;
                    var t = this.hashtag;
                    if (!1 !== t && "twitter" !== t && "facebook" !== t && "instagram" !== t)
                        throw new Error("invalid `hashtag` cfg - see docs");
                    this.truncate = this.normalizeTruncateCfg(e.truncate),
                    this.className = e.className || "",
                    this.replaceFn = e.replaceFn || null,
                    this.htmlParser = null,
                    this.matchers = null,
                    this.tagBuilder = null
                };
                return c.link = function(e, t) {
                    return new c(t).link(e)
                }
                ,
                c.version = "0.28.1",
                c.prototype = {
                    constructor: c,
                    normalizeUrlsCfg: function(e) {
                        return null == e && (e = !0),
                        "boolean" == typeof e ? {
                            schemeMatches: e,
                            wwwMatches: e,
                            tldMatches: e
                        } : {
                            schemeMatches: "boolean" != typeof e.schemeMatches || e.schemeMatches,
                            wwwMatches: "boolean" != typeof e.wwwMatches || e.wwwMatches,
                            tldMatches: "boolean" != typeof e.tldMatches || e.tldMatches
                        }
                    },
                    normalizeTruncateCfg: function(e) {
                        return "number" == typeof e ? {
                            length: e,
                            location: "end"
                        } : c.Util.defaults(e || {}, {
                            length: Number.POSITIVE_INFINITY,
                            location: "end"
                        })
                    },
                    parse: function(e) {
                        for (var t = this.getHtmlParser().parse(e), r = 0, n = [], s = 0, i = t.length; s < i; s++) {
                            var o = t[s]
                              , a = o.getType();
                            if ("element" === a && "a" === o.getTagName())
                                o.isClosing() ? r = Math.max(r - 1, 0) : r++;
                            else if ("text" === a && 0 === r) {
                                var l = this.parseText(o.getText(), o.getOffset());
                                n.push.apply(n, l)
                            }
                        }
                        return n = this.compactMatches(n),
                        this.removeUnwantedMatches(n)
                    },
                    compactMatches: function(e) {
                        e.sort(function(e, t) {
                            return e.getOffset() - t.getOffset()
                        });
                        for (var t = 0; t < e.length - 1; t++)
                            for (var r = e[t], n = r.getOffset() + r.getMatchedText().length; t + 1 < e.length && e[t + 1].getOffset() <= n; )
                                e.splice(t + 1, 1);
                        return e
                    },
                    removeUnwantedMatches: function(e) {
                        var t = c.Util.remove;
                        return this.hashtag || t(e, function(e) {
                            return "hashtag" === e.getType()
                        }),
                        this.email || t(e, function(e) {
                            return "email" === e.getType()
                        }),
                        this.phone || t(e, function(e) {
                            return "phone" === e.getType()
                        }),
                        this.twitter || t(e, function(e) {
                            return "twitter" === e.getType()
                        }),
                        this.urls.schemeMatches || t(e, function(e) {
                            return "url" === e.getType() && "scheme" === e.getUrlMatchType()
                        }),
                        this.urls.wwwMatches || t(e, function(e) {
                            return "url" === e.getType() && "www" === e.getUrlMatchType()
                        }),
                        this.urls.tldMatches || t(e, function(e) {
                            return "url" === e.getType() && "tld" === e.getUrlMatchType()
                        }),
                        e
                    },
                    parseText: function(e, t) {
                        t = t || 0;
                        for (var r = this.getMatchers(), n = [], s = 0, i = r.length; s < i; s++) {
                            for (var o = r[s].parseMatches(e), a = 0, l = o.length; a < l; a++)
                                o[a].setOffset(t + o[a].getOffset());
                            n.push.apply(n, o)
                        }
                        return n
                    },
                    link: function(e) {
                        if (!e)
                            return "";
                        for (var t = this.parse(e), r = [], n = 0, s = 0, i = t.length; s < i; s++) {
                            var o = t[s];
                            r.push(e.substring(n, o.getOffset())),
                            r.push(this.createMatchReturnVal(o)),
                            n = o.getOffset() + o.getMatchedText().length
                        }
                        return r.push(e.substring(n)),
                        r.join("")
                    },
                    createMatchReturnVal: function(e) {
                        var t;
                        return this.replaceFn && (t = this.replaceFn.call(this, this, e)),
                        "string" == typeof t ? t : !1 === t ? e.getMatchedText() : t instanceof c.HtmlTag ? t.toAnchorString() : e.buildTag().toAnchorString()
                    },
                    getHtmlParser: function() {
                        var e = this.htmlParser;
                        return e || (e = this.htmlParser = new c.htmlParser.HtmlParser),
                        e
                    },
                    getMatchers: function() {
                        if (this.matchers)
                            return this.matchers;
                        var e = c.matcher
                          , t = this.getTagBuilder()
                          , r = [new e.Hashtag({
                            tagBuilder: t,
                            serviceName: this.hashtag
                        }), new e.Email({
                            tagBuilder: t
                        }), new e.Phone({
                            tagBuilder: t
                        }), new e.Twitter({
                            tagBuilder: t
                        }), new e.Url({
                            tagBuilder: t,
                            stripPrefix: this.stripPrefix
                        })];
                        return this.matchers = r
                    },
                    getTagBuilder: function() {
                        var e = this.tagBuilder;
                        return e || (e = this.tagBuilder = new c.AnchorTagBuilder({
                            newWindow: this.newWindow,
                            truncate: this.truncate,
                            className: this.className
                        })),
                        e
                    }
                },
                c.match = {},
                c.matcher = {},
                c.htmlParser = {},
                c.truncate = {},
                c.Util = {
                    abstractMethod: function() {
                        throw "abstract"
                    },
                    trimRegex: /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
                    assign: function(e, t) {
                        for (var r in t)
                            t.hasOwnProperty(r) && (e[r] = t[r]);
                        return e
                    },
                    defaults: function(e, t) {
                        for (var r in t)
                            t.hasOwnProperty(r) && void 0 === e[r] && (e[r] = t[r]);
                        return e
                    },
                    extend: function(e, t) {
                        var r, n = e.prototype, s = function() {};
                        s.prototype = n,
                        r = t.hasOwnProperty("constructor") ? t.constructor : function() {
                            n.constructor.apply(this, arguments)
                        }
                        ;
                        var i = r.prototype = new s;
                        return i.constructor = r,
                        i.superclass = n,
                        delete t.constructor,
                        c.Util.assign(i, t),
                        r
                    },
                    ellipsis: function(e, t, r) {
                        return e.length > t && (r = null == r ? ".." : r,
                        e = e.substring(0, t - r.length) + r),
                        e
                    },
                    indexOf: function(e, t) {
                        if (Array.prototype.indexOf)
                            return e.indexOf(t);
                        for (var r = 0, n = e.length; r < n; r++)
                            if (e[r] === t)
                                return r;
                        return -1
                    },
                    remove: function(e, t) {
                        for (var r = e.length - 1; r >= 0; r--)
                            !0 === t(e[r]) && e.splice(r, 1)
                    },
                    splitAndCapture: function(e, t) {
                        if (!t.global)
                            throw new Error("`splitRegex` must have the 'g' flag set");
                        for (var r, n = [], s = 0; r = t.exec(e); )
                            n.push(e.substring(s, r.index)),
                            n.push(r[0]),
                            s = r.index + r[0].length;
                        return n.push(e.substring(s)),
                        n
                    },
                    trim: function(e) {
                        return e.replace(this.trimRegex, "")
                    }
                },
                c.HtmlTag = c.Util.extend(Object, {
                    whitespaceRegex: /\s+/,
                    constructor: function(e) {
                        c.Util.assign(this, e),
                        this.innerHtml = this.innerHtml || this.innerHTML
                    },
                    setTagName: function(e) {
                        return this.tagName = e,
                        this
                    },
                    getTagName: function() {
                        return this.tagName || ""
                    },
                    setAttr: function(e, t) {
                        return this.getAttrs()[e] = t,
                        this
                    },
                    getAttr: function(e) {
                        return this.getAttrs()[e]
                    },
                    setAttrs: function(e) {
                        var t = this.getAttrs();
                        return c.Util.assign(t, e),
                        this
                    },
                    getAttrs: function() {
                        return this.attrs || (this.attrs = {})
                    },
                    setClass: function(e) {
                        return this.setAttr("class", e)
                    },
                    addClass: function(e) {
                        for (var t, r = this.getClass(), n = this.whitespaceRegex, s = c.Util.indexOf, i = r ? r.split(n) : [], o = e.split(n); t = o.shift(); )
                            -1 === s(i, t) && i.push(t);
                        return this.getAttrs().class = i.join(" "),
                        this
                    },
                    removeClass: function(e) {
                        for (var t, r = this.getClass(), n = this.whitespaceRegex, s = c.Util.indexOf, i = r ? r.split(n) : [], o = e.split(n); i.length && (t = o.shift()); ) {
                            var a = s(i, t);
                            -1 !== a && i.splice(a, 1)
                        }
                        return this.getAttrs().class = i.join(" "),
                        this
                    },
                    getClass: function() {
                        return this.getAttrs().class || ""
                    },
                    hasClass: function(e) {
                        return -1 !== (" " + this.getClass() + " ").indexOf(" " + e + " ")
                    },
                    setInnerHtml: function(e) {
                        return this.innerHtml = e,
                        this
                    },
                    getInnerHtml: function() {
                        return this.innerHtml || ""
                    },
                    toAnchorString: function() {
                        var e = this.getTagName()
                          , t = this.buildAttrsStr();
                        return ["<", e, t = t ? " " + t : "", ">", this.getInnerHtml(), "</", e, ">"].join("")
                    },
                    buildAttrsStr: function() {
                        if (!this.attrs)
                            return "";
                        var e = this.getAttrs()
                          , t = [];
                        for (var r in e)
                            e.hasOwnProperty(r) && t.push(r + '="' + e[r] + '"');
                        return t.join(" ")
                    }
                }),
                c.RegexLib = {
                    alphaNumericCharsStr: l = "A-Za-z\\xAA\\xB5\\xBA\\xC0-\\xD6\\xD8-\\xF6\\xF8-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙա-ևא-תװ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࢠ-ࢴऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚౠౡಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೞೠೡೱೲഅ-ഌഎ-ഐഒ-ഺഽൎൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄງຈຊຍດ-ທນ-ຟມ-ຣລວສຫອ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛱ-ᛸᜀ-ᜌᜎ-ᜑᜠ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡷᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭋᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᳩ-ᳬᳮ-ᳱᳵᳶᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕℙ-ℝℤΩℨK-ℭℯ-ℹℼ-ℿⅅ-ⅉⅎↃↄⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞⸯ々〆〱-〵〻〼ぁ-ゖゝ-ゟァ-ヺー-ヿㄅ-ㄭㄱ-ㆎㆠ-ㆺㇰ-ㇿ㐀-䶵一-鿕ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛥꜗ-ꜟꜢ-ꞈꞋ-ꞭꞰ-ꞷꟷ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭥꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ0-9٠-٩۰-۹߀-߉०-९০-৯੦-੯૦-૯୦-୯௦-௯౦-౯೦-೯൦-൯෦-෯๐-๙໐-໙༠-༩၀-၉႐-႙០-៩᠐-᠙᥆-᥏᧐-᧙᪀-᪉᪐-᪙᭐-᭙᮰-᮹᱀-᱉᱐-᱙꘠-꘩꣐-꣙꤀-꤉꧐-꧙꧰-꧹꩐-꩙꯰-꯹０-９",
                    domainNameRegex: new RegExp("[" + l + ".\\-]*[" + l + "\\-]"),
                    tldRegex: /(?:travelersinsurance|sandvikcoromant|kerryproperties|cancerresearch|weatherchannel|kerrylogistics|spreadbetting|international|wolterskluwer|lifeinsurance|construction|pamperedchef|scholarships|versicherung|bridgestone|creditunion|kerryhotels|investments|productions|blackfriday|enterprises|lamborghini|photography|motorcycles|williamhill|playstation|contractors|barclaycard|accountants|redumbrella|engineering|management|telefonica|protection|consulting|tatamotors|creditcard|vlaanderen|schaeffler|associates|properties|foundation|republican|bnpparibas|boehringer|eurovision|extraspace|industries|immobilien|university|technology|volkswagen|healthcare|restaurant|cuisinella|vistaprint|apartments|accountant|travelers|homedepot|institute|vacations|furniture|fresenius|insurance|christmas|bloomberg|solutions|barcelona|firestone|financial|kuokgroup|fairwinds|community|passagens|goldpoint|equipment|lifestyle|yodobashi|aquarelle|marketing|analytics|education|amsterdam|statefarm|melbourne|allfinanz|directory|microsoft|stockholm|montblanc|accenture|lancaster|landrover|everbank|istanbul|graphics|grainger|ipiranga|softbank|attorney|pharmacy|saarland|catering|airforce|yokohama|mortgage|frontier|mutuelle|stcgroup|memorial|pictures|football|symantec|cipriani|ventures|telecity|cityeats|verisign|flsmidth|boutique|cleaning|firmdale|clinique|clothing|redstone|infiniti|deloitte|feedback|services|broadway|plumbing|commbank|training|barclays|exchange|computer|brussels|software|delivery|barefoot|builders|business|bargains|engineer|holdings|download|security|helsinki|lighting|movistar|discount|hdfcbank|supplies|marriott|property|diamonds|capetown|partners|democrat|jpmorgan|bradesco|budapest|rexroth|zuerich|shriram|academy|science|support|youtube|singles|surgery|alibaba|statoil|dentist|schwarz|android|cruises|cricket|digital|markets|starhub|systems|courses|coupons|netbank|country|domains|corsica|network|neustar|realtor|lincoln|limited|schmidt|yamaxun|cooking|contact|auction|spiegel|liaison|leclerc|latrobe|lasalle|abogado|compare|lanxess|exposed|express|company|cologne|college|avianca|lacaixa|fashion|recipes|ferrero|komatsu|storage|wanggou|clubmed|sandvik|fishing|fitness|bauhaus|kitchen|flights|florist|flowers|watches|weather|temasek|samsung|bentley|forsale|channel|theater|frogans|theatre|okinawa|website|tickets|jewelry|gallery|tiffany|iselect|shiksha|brother|organic|wedding|genting|toshiba|origins|philips|hyundai|hotmail|hoteles|hosting|rentals|windows|cartier|bugatti|holiday|careers|whoswho|hitachi|panerai|caravan|reviews|guitars|capital|trading|hamburg|hangout|finance|stream|family|abbott|health|review|travel|report|hermes|hiphop|gratis|career|toyota|hockey|dating|repair|google|social|soccer|reisen|global|otsuka|giving|unicom|casino|photos|center|broker|rocher|orange|bostik|garden|insure|ryukyu|bharti|safety|physio|sakura|oracle|online|jaguar|gallup|piaget|tienda|futbol|pictet|joburg|webcam|berlin|office|juegos|kaufen|chanel|chrome|xihuan|church|tennis|circle|kinder|flickr|bayern|claims|clinic|viajes|nowruz|xperia|norton|yachts|studio|coffee|camera|sanofi|nissan|author|expert|events|comsec|lawyer|tattoo|viking|estate|villas|condos|realty|yandex|energy|emerck|virgin|vision|durban|living|school|coupon|london|taobao|natura|taipei|nagoya|luxury|walter|aramco|sydney|madrid|credit|maison|makeup|schule|market|anquan|direct|design|swatch|suzuki|alsace|vuelos|dental|alipay|voyage|shouji|voting|airtel|mutual|degree|supply|agency|museum|mobily|dealer|monash|select|mormon|active|moscow|racing|datsun|quebec|nissay|rodeo|email|gifts|works|photo|chloe|edeka|cheap|earth|vista|tushu|koeln|glass|shoes|globo|tunes|gmail|nokia|space|kyoto|black|ricoh|seven|lamer|sener|epson|cisco|praxi|trust|citic|crown|shell|lease|green|legal|lexus|ninja|tatar|gripe|nikon|group|video|wales|autos|gucci|party|nexus|guide|linde|adult|parts|amica|lixil|boats|azure|loans|locus|cymru|lotte|lotto|stada|click|poker|quest|dabur|lupin|nadex|paris|faith|dance|canon|place|gives|trade|skype|rocks|mango|cloud|boots|smile|final|swiss|homes|honda|media|horse|cards|deals|watch|bosch|house|pizza|miami|osaka|tours|total|xerox|coach|sucks|style|delta|toray|iinet|tools|money|codes|beats|tokyo|salon|archi|movie|baidu|study|actor|yahoo|store|apple|world|forex|today|bible|tmall|tirol|irish|tires|forum|reise|vegas|vodka|sharp|omega|weber|jetzt|audio|promo|build|bingo|chase|gallo|drive|dubai|rehab|press|solar|sale|beer|bbva|bank|band|auto|sapo|sarl|saxo|audi|asia|arte|arpa|army|yoga|ally|zara|scor|scot|sexy|seat|zero|seek|aero|adac|zone|aarp|maif|meet|meme|menu|surf|mini|mobi|mtpc|porn|desi|star|ltda|name|talk|navy|love|loan|live|link|news|limo|like|spot|life|nico|lidl|lgbt|land|taxi|team|tech|kred|kpmg|sony|song|kiwi|kddi|jprs|jobs|sohu|java|itau|tips|info|immo|icbc|hsbc|town|host|page|toys|here|help|pars|haus|guru|guge|tube|goog|golf|gold|sncf|gmbh|gift|ggee|gent|gbiz|game|vana|pics|fund|ford|ping|pink|fish|film|fast|farm|play|fans|fail|plus|skin|pohl|fage|moda|post|erni|dvag|prod|doha|prof|docs|viva|diet|luxe|site|dell|sina|dclk|show|qpon|date|vote|cyou|voto|read|coop|cool|wang|club|city|chat|cern|cash|reit|rent|casa|cars|care|camp|rest|call|cafe|weir|wien|rich|wiki|buzz|wine|book|bond|room|work|rsvp|shia|ruhr|blue|bing|shaw|bike|safe|xbox|best|pwc|mtn|lds|aig|boo|fyi|nra|nrw|ntt|car|gal|obi|zip|aeg|vin|how|one|ong|onl|dad|ooo|bet|esq|org|htc|bar|uol|ibm|ovh|gdn|ice|icu|uno|gea|ifm|bot|top|wtf|lol|day|pet|eus|wtc|ubs|tvs|aco|ing|ltd|ink|tab|abb|afl|cat|int|pid|pin|bid|cba|gle|com|cbn|ads|man|wed|ceb|gmo|sky|ist|gmx|tui|mba|fan|ski|iwc|app|pro|med|ceo|jcb|jcp|goo|dev|men|aaa|meo|pub|jlc|bom|jll|gop|jmp|mil|got|gov|win|jot|mma|joy|trv|red|cfa|cfd|bio|moe|moi|mom|ren|biz|aws|xin|bbc|dnp|buy|kfh|mov|thd|xyz|fit|kia|rio|rip|kim|dog|vet|nyc|bcg|mtr|bcn|bms|bmw|run|bzh|rwe|tel|stc|axa|kpn|fly|krd|cab|bnl|foo|crs|eat|tci|sap|srl|nec|sas|net|cal|sbs|sfr|sca|scb|csc|edu|new|xxx|hiv|fox|wme|ngo|nhk|vip|sex|frl|lat|yun|law|you|tax|soy|sew|om|ac|hu|se|sc|sg|sh|sb|sa|rw|ru|rs|ro|re|qa|py|si|pw|pt|ps|sj|sk|pr|pn|pm|pl|sl|sm|pk|sn|ph|so|pg|pf|pe|pa|zw|nz|nu|nr|np|no|nl|ni|ng|nf|sr|ne|st|nc|na|mz|my|mx|mw|mv|mu|mt|ms|mr|mq|mp|mo|su|mn|mm|ml|mk|mh|mg|me|sv|md|mc|sx|sy|ma|ly|lv|sz|lu|lt|ls|lr|lk|li|lc|lb|la|tc|kz|td|ky|kw|kr|kp|kn|km|ki|kh|tf|tg|th|kg|ke|jp|jo|jm|je|it|is|ir|tj|tk|tl|tm|iq|tn|to|io|in|im|il|ie|ad|sd|ht|hr|hn|hm|tr|hk|gy|gw|gu|gt|gs|gr|gq|tt|gp|gn|gm|gl|tv|gi|tw|tz|ua|gh|ug|uk|gg|gf|ge|gd|us|uy|uz|va|gb|ga|vc|ve|fr|fo|fm|fk|fj|vg|vi|fi|eu|et|es|er|eg|ee|ec|dz|do|dm|dk|vn|dj|de|cz|cy|cx|cw|vu|cv|cu|cr|co|cn|cm|cl|ck|ci|ch|cg|cf|cd|cc|ca|wf|bz|by|bw|bv|bt|bs|br|bo|bn|bm|bj|bi|ws|bh|bg|bf|be|bd|bb|ba|az|ax|aw|au|at|as|ye|ar|aq|ao|am|al|yt|ai|za|ag|af|ae|zm|id)\b/
                },
                c.AnchorTagBuilder = c.Util.extend(Object, {
                    constructor: function(e) {
                        c.Util.assign(this, e)
                    },
                    build: function(e) {
                        return new c.HtmlTag({
                            tagName: "a",
                            attrs: this.createAttrs(e.getType(), e.getAnchorHref()),
                            innerHtml: this.processAnchorText(e.getAnchorText())
                        })
                    },
                    createAttrs: function(e, t) {
                        var r = {
                            href: t
                        }
                          , n = this.createCssClass(e);
                        return n && (r.class = n),
                        this.newWindow && (r.target = "_blank",
                        r.rel = "noopener noreferrer"),
                        r
                    },
                    createCssClass: function(e) {
                        var t = this.className;
                        return t ? t + " " + t + "-" + e : ""
                    },
                    processAnchorText: function(e) {
                        return this.doTruncate(e)
                    },
                    doTruncate: function(e) {
                        var t = this.truncate;
                        if (!t || !t.length)
                            return e;
                        var r = t.length
                          , n = t.location;
                        return "smart" === n ? c.truncate.TruncateSmart(e, r, "..") : "middle" === n ? c.truncate.TruncateMiddle(e, r, "..") : c.truncate.TruncateEnd(e, r, "..")
                    }
                }),
                c.htmlParser.HtmlParser = c.Util.extend(Object, {
                    htmlRegex: (s = /!--([\s\S]+?)--/,
                    i = /[0-9a-zA-Z][0-9a-zA-Z:]*/,
                    o = /(?:"[^"]*?"|'[^']*?'|[^'"=<>`\s]+)/,
                    a = /[^\s"'>\/=\x00-\x1F\x7F]+/.source + "(?:\\s*=\\s*" + o.source + ")?",
                    new RegExp(["(?:", "<(!DOCTYPE)", "(?:", "\\s+", "(?:", a, "|", o.source + ")", ")*", ">", ")", "|", "(?:", "<(/)?", "(?:", s.source, "|", "(?:", "(" + i.source + ")", "(?:", "(?:\\s+|\\b)", a, ")*", "\\s*/?", ")", ")", ">", ")"].join(""),"gi")),
                    htmlCharacterEntitiesRegex: /(&nbsp;|&#160;|&lt;|&#60;|&gt;|&#62;|&quot;|&#34;|&#39;)/gi,
                    parse: function(e) {
                        for (var t, r, n = this.htmlRegex, s = 0, i = []; null !== (t = n.exec(e)); ) {
                            var o = t[0]
                              , a = t[3]
                              , l = t[1] || t[4]
                              , c = !!t[2]
                              , u = t.index
                              , h = e.substring(s, u);
                            h && (r = this.parseTextAndEntityNodes(s, h),
                            i.push.apply(i, r)),
                            a ? i.push(this.createCommentNode(u, o, a)) : i.push(this.createElementNode(u, o, l, c)),
                            s = u + o.length
                        }
                        if (s < e.length) {
                            var p = e.substring(s);
                            p && (r = this.parseTextAndEntityNodes(s, p),
                            i.push.apply(i, r))
                        }
                        return i
                    },
                    parseTextAndEntityNodes: function(e, t) {
                        for (var r = [], n = c.Util.splitAndCapture(t, this.htmlCharacterEntitiesRegex), s = 0, i = n.length; s < i; s += 2) {
                            var o = n[s]
                              , a = n[s + 1];
                            o && (r.push(this.createTextNode(e, o)),
                            e += o.length),
                            a && (r.push(this.createEntityNode(e, a)),
                            e += a.length)
                        }
                        return r
                    },
                    createCommentNode: function(e, t, r) {
                        return new c.htmlParser.CommentNode({
                            offset: e,
                            text: t,
                            comment: c.Util.trim(r)
                        })
                    },
                    createElementNode: function(e, t, r, n) {
                        return new c.htmlParser.ElementNode({
                            offset: e,
                            text: t,
                            tagName: r.toLowerCase(),
                            closing: n
                        })
                    },
                    createEntityNode: function(e, t) {
                        return new c.htmlParser.EntityNode({
                            offset: e,
                            text: t
                        })
                    },
                    createTextNode: function(e, t) {
                        return new c.htmlParser.TextNode({
                            offset: e,
                            text: t
                        })
                    }
                }),
                c.htmlParser.HtmlNode = c.Util.extend(Object, {
                    offset: void 0,
                    text: void 0,
                    constructor: function(e) {
                        if (c.Util.assign(this, e),
                        null == this.offset)
                            throw new Error("`offset` cfg required");
                        if (null == this.text)
                            throw new Error("`text` cfg required")
                    },
                    getType: c.Util.abstractMethod,
                    getOffset: function() {
                        return this.offset
                    },
                    getText: function() {
                        return this.text
                    }
                }),
                c.htmlParser.CommentNode = c.Util.extend(c.htmlParser.HtmlNode, {
                    comment: "",
                    getType: function() {
                        return "comment"
                    },
                    getComment: function() {
                        return this.comment
                    }
                }),
                c.htmlParser.ElementNode = c.Util.extend(c.htmlParser.HtmlNode, {
                    tagName: "",
                    closing: !1,
                    getType: function() {
                        return "element"
                    },
                    getTagName: function() {
                        return this.tagName
                    },
                    isClosing: function() {
                        return this.closing
                    }
                }),
                c.htmlParser.EntityNode = c.Util.extend(c.htmlParser.HtmlNode, {
                    getType: function() {
                        return "entity"
                    }
                }),
                c.htmlParser.TextNode = c.Util.extend(c.htmlParser.HtmlNode, {
                    getType: function() {
                        return "text"
                    }
                }),
                c.match.Match = c.Util.extend(Object, {
                    constructor: function(e) {
                        if (null == e.tagBuilder)
                            throw new Error("`tagBuilder` cfg required");
                        if (null == e.matchedText)
                            throw new Error("`matchedText` cfg required");
                        if (null == e.offset)
                            throw new Error("`offset` cfg required");
                        this.tagBuilder = e.tagBuilder,
                        this.matchedText = e.matchedText,
                        this.offset = e.offset
                    },
                    getType: c.Util.abstractMethod,
                    getMatchedText: function() {
                        return this.matchedText
                    },
                    setOffset: function(e) {
                        this.offset = e
                    },
                    getOffset: function() {
                        return this.offset
                    },
                    getAnchorHref: c.Util.abstractMethod,
                    getAnchorText: c.Util.abstractMethod,
                    buildTag: function() {
                        return this.tagBuilder.build(this)
                    }
                }),
                c.match.Email = c.Util.extend(c.match.Match, {
                    constructor: function(e) {
                        if (c.match.Match.prototype.constructor.call(this, e),
                        !e.email)
                            throw new Error("`email` cfg required");
                        this.email = e.email
                    },
                    getType: function() {
                        return "email"
                    },
                    getEmail: function() {
                        return this.email
                    },
                    getAnchorHref: function() {
                        return "mailto:" + this.email
                    },
                    getAnchorText: function() {
                        return this.email
                    }
                }),
                c.match.Hashtag = c.Util.extend(c.match.Match, {
                    constructor: function(e) {
                        if (c.match.Match.prototype.constructor.call(this, e),
                        !e.hashtag)
                            throw new Error("`hashtag` cfg required");
                        this.serviceName = e.serviceName,
                        this.hashtag = e.hashtag
                    },
                    getType: function() {
                        return "hashtag"
                    },
                    getServiceName: function() {
                        return this.serviceName
                    },
                    getHashtag: function() {
                        return this.hashtag
                    },
                    getAnchorHref: function() {
                        var e = this.serviceName
                          , t = this.hashtag;
                        switch (e) {
                        case "twitter":
                            return "https://twitter.com/hashtag/" + t;
                        case "facebook":
                            return "https://www.facebook.com/hashtag/" + t;
                        case "instagram":
                            return "https://instagram.com/explore/tags/" + t;
                        default:
                            throw new Error("Unknown service name to point hashtag to: ",e)
                        }
                    },
                    getAnchorText: function() {
                        return "#" + this.hashtag
                    }
                }),
                c.match.Phone = c.Util.extend(c.match.Match, {
                    constructor: function(e) {
                        if (c.match.Match.prototype.constructor.call(this, e),
                        !e.number)
                            throw new Error("`number` cfg required");
                        if (null == e.plusSign)
                            throw new Error("`plusSign` cfg required");
                        this.number = e.number,
                        this.plusSign = e.plusSign
                    },
                    getType: function() {
                        return "phone"
                    },
                    getNumber: function() {
                        return this.number
                    },
                    getAnchorHref: function() {
                        return "tel:" + (this.plusSign ? "+" : "") + this.number
                    },
                    getAnchorText: function() {
                        return this.matchedText
                    }
                }),
                c.match.Twitter = c.Util.extend(c.match.Match, {
                    constructor: function(e) {
                        if (c.match.Match.prototype.constructor.call(this, e),
                        !e.twitterHandle)
                            throw new Error("`twitterHandle` cfg required");
                        this.twitterHandle = e.twitterHandle
                    },
                    getType: function() {
                        return "twitter"
                    },
                    getTwitterHandle: function() {
                        return this.twitterHandle
                    },
                    getAnchorHref: function() {
                        return "https://twitter.com/" + this.twitterHandle
                    },
                    getAnchorText: function() {
                        return "@" + this.twitterHandle
                    }
                }),
                c.match.Url = c.Util.extend(c.match.Match, {
                    constructor: function(e) {
                        if (c.match.Match.prototype.constructor.call(this, e),
                        "scheme" !== e.urlMatchType && "www" !== e.urlMatchType && "tld" !== e.urlMatchType)
                            throw new Error('`urlMatchType` cfg must be one of: "scheme", "www", or "tld"');
                        if (!e.url)
                            throw new Error("`url` cfg required");
                        if (null == e.protocolUrlMatch)
                            throw new Error("`protocolUrlMatch` cfg required");
                        if (null == e.protocolRelativeMatch)
                            throw new Error("`protocolRelativeMatch` cfg required");
                        if (null == e.stripPrefix)
                            throw new Error("`stripPrefix` cfg required");
                        this.urlMatchType = e.urlMatchType,
                        this.url = e.url,
                        this.protocolUrlMatch = e.protocolUrlMatch,
                        this.protocolRelativeMatch = e.protocolRelativeMatch,
                        this.stripPrefix = e.stripPrefix
                    },
                    urlPrefixRegex: /^(https?:\/\/)?(www\.)?/i,
                    protocolRelativeRegex: /^\/\//,
                    protocolPrepended: !1,
                    getType: function() {
                        return "url"
                    },
                    getUrlMatchType: function() {
                        return this.urlMatchType
                    },
                    getUrl: function() {
                        var e = this.url;
                        return this.protocolRelativeMatch || this.protocolUrlMatch || this.protocolPrepended || (e = this.url = "http://" + e,
                        this.protocolPrepended = !0),
                        e
                    },
                    getAnchorHref: function() {
                        return this.getUrl().replace(/&amp;/g, "&")
                    },
                    getAnchorText: function() {
                        var e = this.getMatchedText();
                        return this.protocolRelativeMatch && (e = this.stripProtocolRelativePrefix(e)),
                        this.stripPrefix && (e = this.stripUrlPrefix(e)),
                        this.removeTrailingSlash(e)
                    },
                    stripUrlPrefix: function(e) {
                        return e.replace(this.urlPrefixRegex, "")
                    },
                    stripProtocolRelativePrefix: function(e) {
                        return e.replace(this.protocolRelativeRegex, "")
                    },
                    removeTrailingSlash: function(e) {
                        return "/" === e.charAt(e.length - 1) && (e = e.slice(0, -1)),
                        e
                    }
                }),
                c.matcher.Matcher = c.Util.extend(Object, {
                    constructor: function(e) {
                        if (!e.tagBuilder)
                            throw new Error("`tagBuilder` cfg required");
                        this.tagBuilder = e.tagBuilder
                    },
                    parseMatches: c.Util.abstractMethod
                }),
                c.matcher.Email = c.Util.extend(c.matcher.Matcher, {
                    matcherRegex: (e = c.RegexLib.alphaNumericCharsStr,
                    t = new RegExp("[" + e + "\\-_';:&=+$.,]+@"),
                    r = c.RegexLib.domainNameRegex,
                    n = c.RegexLib.tldRegex,
                    new RegExp([t.source, r.source, "\\.", n.source].join(""),"gi")),
                    parseMatches: function(e) {
                        for (var t, r = this.matcherRegex, n = this.tagBuilder, s = []; null !== (t = r.exec(e)); ) {
                            var i = t[0];
                            s.push(new c.match.Email({
                                tagBuilder: n,
                                matchedText: i,
                                offset: t.index,
                                email: i
                            }))
                        }
                        return s
                    }
                }),
                c.matcher.Hashtag = c.Util.extend(c.matcher.Matcher, {
                    matcherRegex: new RegExp("#[_" + c.RegexLib.alphaNumericCharsStr + "]{1,139}","g"),
                    nonWordCharRegex: new RegExp("[^" + c.RegexLib.alphaNumericCharsStr + "]"),
                    constructor: function(e) {
                        c.matcher.Matcher.prototype.constructor.call(this, e),
                        this.serviceName = e.serviceName
                    },
                    parseMatches: function(e) {
                        for (var t, r = this.matcherRegex, n = this.nonWordCharRegex, s = this.serviceName, i = this.tagBuilder, o = []; null !== (t = r.exec(e)); ) {
                            var a = t.index
                              , l = e.charAt(a - 1);
                            if (0 === a || n.test(l)) {
                                var u = t[0]
                                  , h = t[0].slice(1);
                                o.push(new c.match.Hashtag({
                                    tagBuilder: i,
                                    matchedText: u,
                                    offset: a,
                                    serviceName: s,
                                    hashtag: h
                                }))
                            }
                        }
                        return o
                    }
                }),
                c.matcher.Phone = c.Util.extend(c.matcher.Matcher, {
                    matcherRegex: /(?:(\+)?\d{1,3}[-\040.])?\(?\d{3}\)?[-\040.]?\d{3}[-\040.]\d{4}/g,
                    parseMatches: function(e) {
                        for (var t, r = this.matcherRegex, n = this.tagBuilder, s = []; null !== (t = r.exec(e)); ) {
                            var i = t[0]
                              , o = i.replace(/\D/g, "")
                              , a = !!t[1];
                            s.push(new c.match.Phone({
                                tagBuilder: n,
                                matchedText: i,
                                offset: t.index,
                                number: o,
                                plusSign: a
                            }))
                        }
                        return s
                    }
                }),
                c.matcher.Twitter = c.Util.extend(c.matcher.Matcher, {
                    matcherRegex: new RegExp("@[_" + c.RegexLib.alphaNumericCharsStr + "]{1,20}","g"),
                    nonWordCharRegex: new RegExp("[^" + c.RegexLib.alphaNumericCharsStr + "]"),
                    parseMatches: function(e) {
                        for (var t, r = this.matcherRegex, n = this.nonWordCharRegex, s = this.tagBuilder, i = []; null !== (t = r.exec(e)); ) {
                            var o = t.index
                              , a = e.charAt(o - 1);
                            if (0 === o || n.test(a)) {
                                var l = t[0]
                                  , u = t[0].slice(1);
                                i.push(new c.match.Twitter({
                                    tagBuilder: s,
                                    matchedText: l,
                                    offset: o,
                                    twitterHandle: u
                                }))
                            }
                        }
                        return i
                    }
                }),
                c.matcher.Url = c.Util.extend(c.matcher.Matcher, {
                    matcherRegex: function() {
                        var e = c.RegexLib.domainNameRegex
                          , t = c.RegexLib.tldRegex
                          , r = c.RegexLib.alphaNumericCharsStr
                          , n = new RegExp("[" + r + "\\-+&@#/%=~_()|'$*\\[\\]?!:,.;]*[" + r + "\\-+&@#/%=~_()|'$*\\[\\]]");
                        return new RegExp(["(?:", "(", /(?:[A-Za-z][-.+A-Za-z0-9]*:(?![A-Za-z][-.+A-Za-z0-9]*:\/\/)(?!\d+\/?)(?:\/\/)?)/.source, e.source, ")", "|", "(", "(//)?", /(?:www\.)/.source, e.source, ")", "|", "(", "(//)?", e.source + "\\.", t.source, ")", ")", "(?:" + n.source + ")?"].join(""),"gi")
                    }(),
                    wordCharRegExp: /\w/,
                    openParensRe: /\(/g,
                    closeParensRe: /\)/g,
                    constructor: function(e) {
                        if (c.matcher.Matcher.prototype.constructor.call(this, e),
                        this.stripPrefix = e.stripPrefix,
                        null == this.stripPrefix)
                            throw new Error("`stripPrefix` cfg required")
                    },
                    parseMatches: function(e) {
                        for (var t, r = this.matcherRegex, n = this.stripPrefix, s = this.tagBuilder, i = []; null !== (t = r.exec(e)); ) {
                            var o = t[0]
                              , a = t[1]
                              , l = t[2]
                              , u = t[3]
                              , h = t[5]
                              , p = t.index
                              , f = u || h
                              , d = e.charAt(p - 1);
                            if (c.matcher.UrlMatchValidator.isValid(o, a) && !(p > 0 && "@" === d || p > 0 && f && this.wordCharRegExp.test(d))) {
                                if (this.matchHasUnbalancedClosingParen(o))
                                    o = o.substr(0, o.length - 1);
                                else {
                                    var g = this.matchHasInvalidCharAfterTld(o, a);
                                    g > -1 && (o = o.substr(0, g))
                                }
                                var m = a ? "scheme" : l ? "www" : "tld"
                                  , b = !!a;
                                i.push(new c.match.Url({
                                    tagBuilder: s,
                                    matchedText: o,
                                    offset: p,
                                    urlMatchType: m,
                                    url: o,
                                    protocolUrlMatch: b,
                                    protocolRelativeMatch: !!f,
                                    stripPrefix: n
                                }))
                            }
                        }
                        return i
                    },
                    matchHasUnbalancedClosingParen: function(e) {
                        if (")" === e.charAt(e.length - 1)) {
                            var t = e.match(this.openParensRe)
                              , r = e.match(this.closeParensRe);
                            if ((t && t.length || 0) < (r && r.length || 0))
                                return !0
                        }
                        return !1
                    },
                    matchHasInvalidCharAfterTld: function(e, t) {
                        if (!e)
                            return -1;
                        var r = 0;
                        t && (r = e.indexOf(":"),
                        e = e.slice(r));
                        var n = /^((.?\/\/)?[A-Za-z0-9\u00C0-\u017F\.\-]*[A-Za-z0-9\u00C0-\u017F\-]\.[A-Za-z]+)/.exec(e);
                        return null === n ? -1 : (r += n[1].length,
                        e = e.slice(n[1].length),
                        /^[^.A-Za-z:\/?#]/.test(e) ? r : -1)
                    }
                }),
                c.matcher.UrlMatchValidator = {
                    hasFullProtocolRegex: /^[A-Za-z][-.+A-Za-z0-9]*:\/\//,
                    uriSchemeRegex: /^[A-Za-z][-.+A-Za-z0-9]*:/,
                    hasWordCharAfterProtocolRegex: /:[^\s]*?[A-Za-z\u00C0-\u017F]/,
                    ipRegex: /[0-9][0-9]?[0-9]?\.[0-9][0-9]?[0-9]?\.[0-9][0-9]?[0-9]?\.[0-9][0-9]?[0-9]?(:[0-9]*)?\/?$/,
                    isValid: function(e, t) {
                        return !(t && !this.isValidUriScheme(t) || this.urlMatchDoesNotHaveProtocolOrDot(e, t) || this.urlMatchDoesNotHaveAtLeastOneWordChar(e, t) && !this.isValidIpAddress(e))
                    },
                    isValidIpAddress: function(e) {
                        var t = new RegExp(this.hasFullProtocolRegex.source + this.ipRegex.source);
                        return null !== e.match(t)
                    },
                    isValidUriScheme: function(e) {
                        var t = e.match(this.uriSchemeRegex)[0].toLowerCase();
                        return "javascript:" !== t && "vbscript:" !== t
                    },
                    urlMatchDoesNotHaveProtocolOrDot: function(e, t) {
                        return !(!e || t && this.hasFullProtocolRegex.test(t) || -1 !== e.indexOf("."))
                    },
                    urlMatchDoesNotHaveAtLeastOneWordChar: function(e, t) {
                        return !(!e || !t || this.hasWordCharAfterProtocolRegex.test(e))
                    }
                },
                c.truncate.TruncateEnd = function(e, t, r) {
                    return c.Util.ellipsis(e, t, r)
                }
                ,
                c.truncate.TruncateMiddle = function(e, t, r) {
                    if (e.length <= t)
                        return e;
                    var n = t - r.length
                      , s = "";
                    return n > 0 && (s = e.substr(-1 * Math.floor(n / 2))),
                    (e.substr(0, Math.ceil(n / 2)) + r + s).substr(0, t)
                }
                ,
                c.truncate.TruncateSmart = function(e, t, r) {
                    var n = function(e) {
                        var t = "";
                        return e.scheme && e.host && (t += e.scheme + "://"),
                        e.host && (t += e.host),
                        e.path && (t += "/" + e.path),
                        e.query && (t += "?" + e.query),
                        e.fragment && (t += "#" + e.fragment),
                        t
                    }
                      , s = function(e, t) {
                        var n = t / 2
                          , s = Math.ceil(n)
                          , i = -1 * Math.floor(n)
                          , o = "";
                        return i < 0 && (o = e.substr(i)),
                        e.substr(0, s) + r + o
                    };
                    if (e.length <= t)
                        return e;
                    var i = t - r.length
                      , o = function(e) {
                        var t = {}
                          , r = e
                          , n = r.match(/^([a-z]+):\/\//i);
                        return n && (t.scheme = n[1],
                        r = r.substr(n[0].length)),
                        (n = r.match(/^(.*?)(?=(\?|#|\/|$))/i)) && (t.host = n[1],
                        r = r.substr(n[0].length)),
                        (n = r.match(/^\/(.*?)(?=(\?|#|$))/i)) && (t.path = n[1],
                        r = r.substr(n[0].length)),
                        (n = r.match(/^\?(.*?)(?=(#|$))/i)) && (t.query = n[1],
                        r = r.substr(n[0].length)),
                        (n = r.match(/^#(.*?)$/i)) && (t.fragment = n[1]),
                        t
                    }(e);
                    if (o.query) {
                        var a = o.query.match(/^(.*?)(?=(\?|\#))(.*?)$/i);
                        a && (o.query = o.query.substr(0, a[1].length),
                        e = n(o))
                    }
                    if (e.length <= t)
                        return e;
                    if (o.host && (o.host = o.host.replace(/^www\./, ""),
                    e = n(o)),
                    e.length <= t)
                        return e;
                    var l = "";
                    if (o.host && (l += o.host),
                    l.length >= i)
                        return o.host.length == t ? (o.host.substr(0, t - r.length) + r).substr(0, t) : s(l, i).substr(0, t);
                    var c = "";
                    if (o.path && (c += "/" + o.path),
                    o.query && (c += "?" + o.query),
                    c) {
                        if ((l + c).length >= i)
                            return (l + c).length == t ? (l + c).substr(0, t) : (l + s(c, i - l.length)).substr(0, t);
                        l += c
                    }
                    if (o.fragment) {
                        var u = "#" + o.fragment;
                        if ((l + u).length >= i)
                            return (l + u).length == t ? (l + u).substr(0, t) : (l + s(u, i - l.length)).substr(0, t);
                        l += u
                    }
                    if (o.scheme && o.host) {
                        var h = o.scheme + "://";
                        if ((l + h).length < i)
                            return (h + l).substr(0, t)
                    }
                    if (l.length <= t)
                        return l;
                    var p = "";
                    return i > 0 && (p = l.substr(-1 * Math.floor(i / 2))),
                    (l.substr(0, Math.ceil(i / 2)) + r + p).substr(0, t)
                }
                ,
                c
            }
            ,
            void 0 === (n = r.apply(t, [])) || (e.exports = n)
        },
        2781(e, t, r) {
            var n, s, i;
            s = [r(3893)],
            n = function(e) {
                function t(e, t) {
                    return e.parent == t.parent ? 1 : 2
                }
                function r(t) {
                    return e.merge(t.map(function(e) {
                        return (e.children || []).map(function(t) {
                            return {
                                source: e,
                                target: t
                            }
                        })
                    }))
                }
                e.layout.flextree = function() {
                    var n = e.layout.hierarchy().sort(null).value(null)
                      , s = t
                      , i = null
                      , o = [1, 1]
                      , a = null
                      , l = !1
                      , c = null;
                    function u(e, t) {
                        var r = n.call(this, e, t)
                          , i = h(r[0]);
                        return c = i,
                        function(e, t) {
                            e.t.y = t,
                            e.t.depth = 0,
                            p(e)
                        }(i, 0),
                        f(i),
                        y(i, 0),
                        function(e) {
                            if (null != o) {
                                for (var t, r = e, n = e, i = e, a = [e]; t = a.pop(); )
                                    (f = t.t).x < r.t.x && (r = t),
                                    f.x > n.t.x && (n = t),
                                    f.depth > i.t.depth && (i = t),
                                    t.children && (a = a.concat(t.children));
                                var c = null == s ? .5 : s(r.t, n.t) / 2
                                  , u = c - r.t.x
                                  , h = o[0] / (n.t.x + c + u)
                                  , p = o[1] / (i.t.depth > 0 ? i.t.depth : 1);
                                for (a = [e]; t = a.pop(); ) {
                                    var f;
                                    (f = t.t).x = (f.x + u) * h,
                                    f.y = f.depth * p,
                                    l && (f.x_size *= h,
                                    f.y_size *= p),
                                    t.children && (a = a.concat(t.children))
                                }
                            } else
                                w(e, -e.t.x)
                        }(i),
                        r
                    }
                    function h(e) {
                        var t = {
                            t: e,
                            prelim: 0,
                            mod: 0,
                            shift: 0,
                            change: 0,
                            msel: 0,
                            mser: 0
                        };
                        if (e.x = 0,
                        e.y = 0,
                        o)
                            t.x_size = 1,
                            t.y_size = 1;
                        else if ("object" == typeof a)
                            t.x_size = a[0],
                            t.y_size = a[1];
                        else {
                            var r = a(e);
                            t.x_size = r[0],
                            t.y_size = r[1]
                        }
                        l && (e.x_size = t.x_size,
                        e.y_size = t.y_size);
                        for (var n = [], s = e.children ? e.children.length : 0, i = 0; i < s; ++i)
                            n.push(h(e.children[i]));
                        return t.children = n,
                        t.num_children = s,
                        t
                    }
                    function p(e) {
                        var t, r = e.t.y + e.y_size, n = e.t.depth + 1;
                        for (t = 0; t < e.children.length; ++t) {
                            var s = e.children[t];
                            s.t.y = r,
                            s.t.parent = e.t,
                            s.t.depth = n,
                            p(e.children[t])
                        }
                    }
                    function f(e) {
                        if (0 != e.num_children) {
                            f(e.children[0]);
                            for (var t = x(k(e.children[0].el), 0, null), r = 1; r < e.num_children; ++r) {
                                f(e.children[r]);
                                var n = k(e.children[r].er);
                                g(e, r, t),
                                t = x(n, r, t)
                            }
                            (function(e) {
                                e.prelim = (e.children[0].prelim + e.children[0].mod - e.children[0].x_size / 2 + e.children[e.num_children - 1].mod + e.children[e.num_children - 1].prelim + e.children[e.num_children - 1].x_size / 2) / 2
                            }
                            )(e),
                            d(e)
                        } else
                            d(e)
                    }
                    function d(e) {
                        0 == e.num_children ? (e.el = e,
                        e.er = e,
                        e.msel = e.mser = 0) : (e.el = e.children[0].el,
                        e.msel = e.children[0].msel,
                        e.er = e.children[e.num_children - 1].er,
                        e.mser = e.children[e.num_children - 1].mser)
                    }
                    function g(e, t, r) {
                        for (var n = e.children[t - 1], o = n.mod, a = e.children[t], l = a.mod; null != n && null != a; ) {
                            k(n) > r.lowY && (r = r.nxt);
                            var u = o + n.prelim - (l + a.prelim);
                            null != s ? u += s(n.t, a.t) * c.x_size : null != i && (u += n.x_size / 2 + a.x_size / 2 + i(n.t, a.t)),
                            (u > 0 || 1 === t && 0 === l && 0 === n.num_children && a.num_children > 1 && u < 0) && (l += u,
                            m(e, t, r.index, u));
                            var h = k(n)
                              , p = k(a);
                            h <= p && null != (n = v(n)) && (o += n.mod),
                            h >= p && null != (a = b(a)) && (l += a.mod)
                        }
                        null == n && null != a ? function(e, t, r, n) {
                            var s = e.children[0].el;
                            s.tl = r;
                            var i = n - r.mod - e.children[0].msel;
                            s.mod += i,
                            s.prelim -= i,
                            e.children[0].el = e.children[t].el,
                            e.children[0].msel = e.children[t].msel
                        }(e, t, a, l) : null != n && null == a && function(e, t, r, n) {
                            var s = e.children[t].er;
                            s.tr = r;
                            var i = n - r.mod - e.children[t].mser;
                            s.mod += i,
                            s.prelim -= i,
                            e.children[t].er = e.children[t - 1].er,
                            e.children[t].mser = e.children[t - 1].mser
                        }(e, t, n, o)
                    }
                    function m(e, t, r, n) {
                        e.children[t].mod += n,
                        e.children[t].msel += n,
                        e.children[t].mser += n,
                        function(e, t, r, n) {
                            if (r != t - 1) {
                                var s = t - r;
                                e.children[r + 1].shift += n / s,
                                e.children[t].shift -= n / s,
                                e.children[t].change -= n - n / s
                            }
                        }(e, t, r, n)
                    }
                    function b(e) {
                        return 0 == e.num_children ? e.tl : e.children[0]
                    }
                    function v(e) {
                        return 0 == e.num_children ? e.tr : e.children[e.num_children - 1]
                    }
                    function k(e) {
                        return e.t.y + e.y_size
                    }
                    function y(e, t) {
                        t += e.mod,
                        e.t.x = e.prelim + t,
                        function(e) {
                            for (var t = 0, r = 0, n = 0; n < e.num_children; n++)
                                r += (t += e.children[n].shift) + e.children[n].change,
                                e.children[n].mod += r
                        }(e);
                        for (var r = 0; r < e.num_children; r++)
                            y(e.children[r], t)
                    }
                    function x(e, t, r) {
                        for (; null != r && e >= r.lowY; )
                            r = r.nxt;
                        return {
                            lowY: e,
                            index: t,
                            nxt: r
                        }
                    }
                    function w(e, t) {
                        e.t.x += t;
                        for (var r = 0; r < e.num_children; ++r)
                            w(e.children[r], t)
                    }
                    return u.separation = function(e) {
                        return arguments.length ? (s = e,
                        i = null,
                        u) : s
                    }
                    ,
                    u.spacing = function(e) {
                        return arguments.length ? (i = e,
                        s = null,
                        u) : i
                    }
                    ,
                    u.size = function(e) {
                        return arguments.length ? (o = e,
                        a = null,
                        u) : o
                    }
                    ,
                    u.nodeSize = function(e) {
                        return arguments.length ? (a = e,
                        o = null,
                        u) : a
                    }
                    ,
                    u.setNodeSizes = function(e) {
                        return arguments.length ? (l = e,
                        u) : l
                    }
                    ,
                    u.rootXSize = function() {
                        return c ? c.x_size : null
                    }
                    ,
                    function(t, n) {
                        return e.rebind(t, n, "sort", "children", "value"),
                        t.nodes = t,
                        t.links = r,
                        t
                    }(u, n)
                }
            }
            ,
            void 0 === (i = n.apply(t, s)) || (e.exports = i)
        },
        3086(e, t, r) {
            var n = r(7681);
            function s(e) {
                for (var t, r, n = [], s = 0; s < e.length; s += 1) {
                    var i = e[s];
                    switch (i.type) {
                    case "link_open":
                        t = i.href,
                        r = [];
                        break;
                    case "text":
                        r && r.push(i.content);
                        break;
                    case "link_close":
                        n.push({
                            href: t,
                            name: r.join("")
                        }),
                        r = null
                    }
                }
                return n
            }
            function i(e) {
                for (var t = [], r = 0; r < e.length; r += 1) {
                    var n = e[r];
                    if ("text" === n.type && n.content)
                        t.push(n.content);
                    else if ("softbreak" === n.type)
                        break
                }
                return t.join("")
            }
            e.exports = function e(t, r) {
                r = r || {},
                parseLists = !1 !== r.lists,
                parseLinks = Boolean(r.links);
                var o = new n;
                o.block.ruler.enable(["deflist"]);
                for (var a = o.parse(t, {}), l = [], c = 0, u = 0; u < a.length; u += 1)
                    if ("heading_open" === a[u].type)
                        c = a[u].hLevel,
                        l.push({
                            depth: c,
                            line: a[u].lines[0],
                            name: a[u + 1].content || ""
                        }),
                        u += 1;
                    else if ("inline" === a[u].type)
                        parseLinks && (l = l.concat(s(a[u].children).map(function(e) {
                            return e.depth = c + 1,
                            e.line = a[u].lines[0],
                            e
                        })));
                    else if (parseLists)
                        switch (a[u].type) {
                        case "bullet_list_open":
                        case "dl_open":
                        case "ordered_list_open":
                            l.push({
                                depth: c + 1,
                                line: a[u].lines[0],
                                name: "",
                                autoCollapse: !0
                            }),
                            c += 2;
                            break;
                        case "bullet_list_close":
                        case "dl_close":
                        case "ordered_list_close":
                            c -= 2;
                            break;
                        case "list_item_open":
                            var h = {
                                depth: c,
                                line: a[u].lines[0]
                            };
                            if ("list_item_close" === a[u + 1].type)
                                h.name = "",
                                u += 1;
                            else {
                                if (h.name = i(a[u + 2].children || []),
                                parseLinks) {
                                    var p = e(a[u + 2].content || "", r)[0];
                                    p && (h.href = p.href)
                                }
                                u += 2
                            }
                            l.push(h);
                            break;
                        case "dt_open":
                            l.push({
                                depth: c,
                                line: a[u].lines[0],
                                name: a[u + 1].content || ""
                            }),
                            u += 1
                        }
                return l
            }
        },
        5701(e) {
            function t(e, r) {
                return e.depth -= r,
                e.children && 1 === e.children.length && e.children[0].autoCollapse && (e.children = e.children[0].children,
                r += 1),
                e.children && (e.children = e.children.map(function(e) {
                    return e.autoCollapse && e.children && 1 === e.children.length ? t(e.children[0], r + 1) : t(e, r)
                })),
                e.autoCollapse && delete e.autoCollapse,
                e
            }
            e.exports = function(e) {
                var r, n = {
                    name: "root",
                    depth: 0,
                    children: []
                }, s = n, i = [];
                return e.forEach(function(e) {
                    for (; e.depth < s.depth + 1; )
                        s = i.pop();
                    for (; e.depth > s.depth + 1; )
                        s.children && 0 !== s.children.length || (r = {
                            name: "",
                            depth: s.depth + 1
                        },
                        s.children = s.children || [],
                        s.children.push(r)),
                        i.push(s),
                        s = s.children[s.children.length - 1];
                    s.children = s.children || [],
                    s.children.push(e)
                }),
                1 === (n = t(n, 0)).children.length && (n = n.children[0]),
                n
            }
        },
        7949(e, t, r) {
            var n, s, i;
            s = [r(3893)],
            void 0 === (i = "function" == typeof (n = function(e) {
                var t = Object.assign || function(e, t) {
                    for (var r in t)
                        t.hasOwnProperty(r) && (e[r] = t[r]);
                    return e
                }
                ;
                function r(e, t) {
                    var n = (r.canvas || (r.canvas = document.createElement("canvas"))).getContext("2d");
                    return n.font = t,
                    n.measureText(e).width
                }
                function n(e, t, r) {
                    "branch"in e || (e.branch = t),
                    e.children && e.children.forEach(function(e) {
                        n(e, t, r)
                    })
                }
                function s(e) {
                    e.children && (e.children.forEach(s),
                    e.children = [{
                        name: "",
                        dummy: !0,
                        children: e.children
                    }])
                }
                function i(e, t) {
                    e.name.length > t && (e.name = e.name.slice(0, t - 1) + "…"),
                    e.children && e.children.forEach(function(e) {
                        i(e, t)
                    })
                }
                function o(e, t, r) {
                    if (!(this instanceof o))
                        return new o(e,t,r);
                    this.init(e, t, r)
                }
                var a = {
                    nodeHeight: 20,
                    nodeWidth: 180,
                    nodePadding: 12,
                    spacingVertical: 5,
                    spacingHorizontal: 60,
                    truncateLabels: 0,
                    duration: 750,
                    layout: "tree",
                    color: "gray",
                    linkShape: "diagonal",
                    renderer: "boxed"
                };
                return t(o.prototype, {
                    getInitialState: function() {
                        return {
                            zoomScale: 1,
                            zoomTranslate: [0, 0],
                            autoFit: !0,
                            depthMaxSize: {},
                            yByDepth: {},
                            nodeFont: "10px sans-serif"
                        }
                    },
                    presets: {
                        default: a,
                        colorful: t(t({}, a), {
                            nodeHeight: 10,
                            renderer: "basic",
                            color: "category20",
                            nodePadding: 6
                        })
                    },
                    helperNames: ["layout", "linkShape", "color"],
                    layouts: {
                        tree: function(t) {
                            return e.layout.flextree().setNodeSizes(!0).nodeSize(function(e) {
                                var n = e.dummy ? t.state.spacingHorizontal : r(e.name, t.state.nodeFont);
                                return !e.dummy && n > 0 && (n += 2 * t.state.nodePadding),
                                [t.state.nodeHeight, n]
                            }).spacing(function(e, r) {
                                return e.parent == r.parent ? t.state.spacingVertical : 2 * t.state.spacingVertical
                            })
                        }
                    },
                    linkShapes: {
                        diagonal: function() {
                            return e.svg.diagonal().projection(function(e) {
                                return [e.y, e.x]
                            })
                        },
                        bracket: function() {
                            return function(e) {
                                return "M" + e.source.y + "," + e.source.x + "V" + e.target.x + "H" + e.target.y
                            }
                        }
                    },
                    colors: t({
                        gray: function() {
                            return function() {
                                return "#929292"
                            }
                        }
                    }, e.scale),
                    init: function(t, r, n) {
                        n = n || {},
                        t = t.datum ? t : e.select(t),
                        this.helpers = {},
                        this.i = 0;
                        var s = this.state = this.getInitialState();
                        this.set(this.presets[n.preset || "default"]),
                        s.height = t.node().getBoundingClientRect().height,
                        s.width = t.node().getBoundingClientRect().width,
                        this.set(n),
                        t.on("mousedown", function() {
                            var t = e.event;
                            2 === t.button && t.stopImmediatePropagation()
                        });
                        var i = this.zoom = e.behavior.zoom().on("zoom", function() {
                            this.updateZoom(e.event.translate, e.event.scale)
                        }
                        .bind(this));
                        this.svg = t.call(i).append("g"),
                        this.updateZoom(s.zoomTranslate, s.zoomScale),
                        this.setData(r),
                        this.update(s.root),
                        void 0 !== n.autoFit && null !== n.autoFit || (s.autoFit = !1)
                    },
                    updateZoom: function(e, t) {
                        var r = this.state;
                        r.zoomTranslate = e,
                        r.zoomScale = t,
                        this.zoom.translate(r.zoomTranslate).scale(r.zoomScale),
                        this.svg.attr("transform", "translate(" + r.zoomTranslate + ") scale(" + r.zoomScale + ")")
                    },
                    set: function(e) {
                        e.preset && this.set(this.presets[e.preset]);
                        var r = this.state
                          , n = this.helpers;
                        return this.helperNames.forEach(function(t) {
                            (!n[t] || e[t] && e[t] !== r[t]) && (n[t] = this[t + "s"][e[t] || r[t]](this))
                        }
                        .bind(this)),
                        t(r, e || {}),
                        this
                    },
                    preprocessData(e, t) {
                        var r = this.state;
                        r.truncateLabels && i(e, r.truncateLabels),
                        e.children && e.children.forEach(function(e, t) {
                            n(e, t, r)
                        }),
                        t && this.diffTreeState(e, t)
                    },
                    setData: function(e) {
                        var t = this.state;
                        return this.preprocessData(e, t.root),
                        t.root = e,
                        t.root.x0 = t.height / 2,
                        t.root.y0 = 0,
                        this
                    },
                    diffTreeState: function(e, t) {
                        var r = e.children
                          , n = t.children || t._children;
                        if (r && n) {
                            var s;
                            r.length !== n.length && (s = n.reduce(function(e, t) {
                                return e[t.name] = e[t.name] || [],
                                e[t.name].push(t),
                                e
                            }, {}));
                            for (var i = 0; i < r.length; i += 1) {
                                var o;
                                if (s) {
                                    var a = s[r[i].name];
                                    a && (o = a[0],
                                    s[r[i].name] = a.slice(1))
                                } else
                                    o = n[i];
                                o && this.diffTreeState(r[i], o)
                            }
                            t._children && (e._children = e.children,
                            delete e.children)
                        }
                        return e
                    },
                    update: function(t) {
                        var r = this.state;
                        t = t || r.root;
                        var n = this.layout(r);
                        if (r.autoFit) {
                            var s = e.min(n.nodes, function(e) {
                                return e.x
                            })
                              , i = e.min(n.nodes, function(e) {
                                return e.y
                            })
                              , o = e.max(n.nodes, function(e) {
                                return e.x
                            }) - s
                              , a = e.max(n.nodes, function(e) {
                                return e.y + e.y_size
                            }) - i
                              , l = Math.min(r.height / o, r.width / a, 1)
                              , c = [(r.width - a * l) / 2 - i * l, (r.height - o * l) / 2 - s * l];
                            this.updateZoom(c, l)
                        }
                        return this.render(t, n.nodes, n.links),
                        this
                    },
                    layout: function(e) {
                        var t = this.helpers.layout;
                        "bracket" !== e.linkShape && s(e.root);
                        var r = t.nodes(e.root).reverse();
                        return (r = r.filter(function(e) {
                            return !e.dummy
                        })).forEach(function(e) {
                            e.children && 1 === e.children.length && e.children[0].dummy && (e.children = e.children[0].children),
                            e.parent && e.parent.dummy && (e.parent = e.parent.parent)
                        }),
                        "bracket" === e.linkShape && r.forEach(function(t) {
                            t.y += t.depth * e.spacingHorizontal
                        }),
                        {
                            nodes: r,
                            links: t.links(r)
                        }
                    },
                    render: function(e, t, r) {
                        this.renderers[this.state.renderer].call(this, e, t, r)
                    },
                    renderers: {
                        boxed: function(t, r, n) {
                            var s = this.svg
                              , i = this.state
                              , o = this.helpers.color;
                            this.renderers.basic.call(this, t, r, n);
                            var a = s.selectAll("g.markmap-node");
                            a.select("rect").attr("y", -i.nodeHeight / 2).attr("rx", 10).attr("ry", 10).attr("height", i.nodeHeight).attr("fill", function(t) {
                                return e.rgb(o(t.branch)).brighter(1.2)
                            }).attr("stroke", function(e) {
                                return o(e.branch)
                            }).attr("stroke-width", 1),
                            a.select("text").attr("dy", "3"),
                            s.selectAll("path.markmap-link").attr("stroke-width", 1)
                        },
                        basic: function(e, t, r) {
                            var n = this.svg
                              , s = this.state
                              , i = this.helpers.color
                              , o = this.helpers.linkShape;
                            function a(e) {
                                var t = e.depth;
                                return "" !== e.name && e.children && 1 === e.children.length && "" === e.children[0].name && (t += 1),
                                Math.max(6 - 2 * t, 1.5)
                            }
                            var l = n.selectAll("g.markmap-node").data(t, function(e) {
                                return e.id || (e.id = ++this.i)
                            }
                            .bind(this))
                              , c = l.enter().append("g").attr("class", "markmap-node").attr("transform", function(t) {
                                return "translate(" + (e.y0 + e.y_size - t.y_size) + "," + e.x0 + ")"
                            }).on("click", this.click.bind(this));
                            c.append("rect").attr("class", "markmap-node-rect").attr("y", function(e) {
                                return -a(e) / 2
                            }).attr("x", function(e) {
                                return e.y_size
                            }).attr("width", 0).attr("height", a).attr("fill", function(e) {
                                return i(e.branch)
                            }),
                            c.append("circle").attr("class", "markmap-node-circle").attr("cx", function(e) {
                                return e.y_size
                            }).attr("stroke", function(e) {
                                return i(e.branch)
                            }).attr("r", 1e-6).style("fill", function(e) {
                                return e._children ? i(e.branch) : ""
                            }),
                            c.append("text").attr("class", "markmap-node-text").attr("x", function(e) {
                                return e.y_size
                            }).attr("dy", "-5").attr("text-anchor", function(e) {
                                return "start"
                            }).text(function(e) {
                                return e.name
                            }).style("fill-opacity", 1e-6);
                            var u = l.transition().duration(s.duration).attr("transform", function(e) {
                                return "translate(" + e.y + "," + e.x + ")"
                            });
                            u.select("rect").attr("x", -1).attr("width", function(e) {
                                return e.y_size + 2
                            }),
                            u.select("circle").attr("r", 4.5).style("fill", function(e) {
                                return e._children ? i(e.branch) : ""
                            }).style("display", function(e) {
                                return e.href || e.children || e._children ? "inline" : "none"
                            }),
                            u.select("text").attr("x", 10).style("fill-opacity", 1);
                            var h = l.exit().transition().duration(s.duration).attr("transform", function(t) {
                                return "translate(" + (e.y + e.y_size - t.y_size) + "," + e.x + ")"
                            }).remove();
                            h.select("rect").attr("x", function(e) {
                                return e.y_size
                            }).attr("width", 0),
                            h.select("circle").attr("r", 1e-6),
                            h.select("text").style("fill-opacity", 1e-6).attr("x", function(e) {
                                return e.y_size
                            });
                            var p = n.selectAll("path.markmap-link").data(r, function(e) {
                                return e.target.id
                            });
                            p.enter().insert("path", "g").attr("class", "markmap-link").attr("stroke", function(e) {
                                return i(e.target.branch)
                            }).attr("stroke-width", function(e) {
                                return a(e.target)
                            }).attr("d", function(t) {
                                var r = {
                                    x: e.x0,
                                    y: e.y0 + e.y_size
                                };
                                return o({
                                    source: r,
                                    target: r
                                })
                            }),
                            p.transition().duration(s.duration).attr("d", function(e) {
                                var t = {
                                    x: e.source.x,
                                    y: e.source.y + e.source.y_size
                                }
                                  , r = {
                                    x: e.target.x,
                                    y: e.target.y
                                };
                                return o({
                                    source: t,
                                    target: r
                                })
                            }),
                            p.exit().transition().duration(s.duration).attr("d", function(t) {
                                var r = {
                                    x: e.x,
                                    y: e.y + e.y_size
                                };
                                return o({
                                    source: r,
                                    target: r
                                })
                            }).remove(),
                            t.forEach(function(e) {
                                e.x0 = e.x,
                                e.y0 = e.y
                            })
                        }
                    },
                    click: function(e) {
                        e.children ? (e._children = e.children,
                        e.children = null) : (e.children = e._children,
                        e._children = null),
                        this.update(e)
                    }
                }),
                o
            }
            ) ? n.apply(t, s) : n) || (e.exports = i)
        },
        7681(e, t, r) {
            "use strict";
            e.exports = r(5033)
        },
        3332(e) {
            "use strict";
            e.exports = {
                Aacute: "Á",
                aacute: "á",
                Abreve: "Ă",
                abreve: "ă",
                ac: "∾",
                acd: "∿",
                acE: "∾̳",
                Acirc: "Â",
                acirc: "â",
                acute: "´",
                Acy: "А",
                acy: "а",
                AElig: "Æ",
                aelig: "æ",
                af: "⁡",
                Afr: "𝔄",
                afr: "𝔞",
                Agrave: "À",
                agrave: "à",
                alefsym: "ℵ",
                aleph: "ℵ",
                Alpha: "Α",
                alpha: "α",
                Amacr: "Ā",
                amacr: "ā",
                amalg: "⨿",
                AMP: "&",
                amp: "&",
                And: "⩓",
                and: "∧",
                andand: "⩕",
                andd: "⩜",
                andslope: "⩘",
                andv: "⩚",
                ang: "∠",
                ange: "⦤",
                angle: "∠",
                angmsd: "∡",
                angmsdaa: "⦨",
                angmsdab: "⦩",
                angmsdac: "⦪",
                angmsdad: "⦫",
                angmsdae: "⦬",
                angmsdaf: "⦭",
                angmsdag: "⦮",
                angmsdah: "⦯",
                angrt: "∟",
                angrtvb: "⊾",
                angrtvbd: "⦝",
                angsph: "∢",
                angst: "Å",
                angzarr: "⍼",
                Aogon: "Ą",
                aogon: "ą",
                Aopf: "𝔸",
                aopf: "𝕒",
                ap: "≈",
                apacir: "⩯",
                apE: "⩰",
                ape: "≊",
                apid: "≋",
                apos: "'",
                ApplyFunction: "⁡",
                approx: "≈",
                approxeq: "≊",
                Aring: "Å",
                aring: "å",
                Ascr: "𝒜",
                ascr: "𝒶",
                Assign: "≔",
                ast: "*",
                asymp: "≈",
                asympeq: "≍",
                Atilde: "Ã",
                atilde: "ã",
                Auml: "Ä",
                auml: "ä",
                awconint: "∳",
                awint: "⨑",
                backcong: "≌",
                backepsilon: "϶",
                backprime: "‵",
                backsim: "∽",
                backsimeq: "⋍",
                Backslash: "∖",
                Barv: "⫧",
                barvee: "⊽",
                Barwed: "⌆",
                barwed: "⌅",
                barwedge: "⌅",
                bbrk: "⎵",
                bbrktbrk: "⎶",
                bcong: "≌",
                Bcy: "Б",
                bcy: "б",
                bdquo: "„",
                becaus: "∵",
                Because: "∵",
                because: "∵",
                bemptyv: "⦰",
                bepsi: "϶",
                bernou: "ℬ",
                Bernoullis: "ℬ",
                Beta: "Β",
                beta: "β",
                beth: "ℶ",
                between: "≬",
                Bfr: "𝔅",
                bfr: "𝔟",
                bigcap: "⋂",
                bigcirc: "◯",
                bigcup: "⋃",
                bigodot: "⨀",
                bigoplus: "⨁",
                bigotimes: "⨂",
                bigsqcup: "⨆",
                bigstar: "★",
                bigtriangledown: "▽",
                bigtriangleup: "△",
                biguplus: "⨄",
                bigvee: "⋁",
                bigwedge: "⋀",
                bkarow: "⤍",
                blacklozenge: "⧫",
                blacksquare: "▪",
                blacktriangle: "▴",
                blacktriangledown: "▾",
                blacktriangleleft: "◂",
                blacktriangleright: "▸",
                blank: "␣",
                blk12: "▒",
                blk14: "░",
                blk34: "▓",
                block: "█",
                bne: "=⃥",
                bnequiv: "≡⃥",
                bNot: "⫭",
                bnot: "⌐",
                Bopf: "𝔹",
                bopf: "𝕓",
                bot: "⊥",
                bottom: "⊥",
                bowtie: "⋈",
                boxbox: "⧉",
                boxDL: "╗",
                boxDl: "╖",
                boxdL: "╕",
                boxdl: "┐",
                boxDR: "╔",
                boxDr: "╓",
                boxdR: "╒",
                boxdr: "┌",
                boxH: "═",
                boxh: "─",
                boxHD: "╦",
                boxHd: "╤",
                boxhD: "╥",
                boxhd: "┬",
                boxHU: "╩",
                boxHu: "╧",
                boxhU: "╨",
                boxhu: "┴",
                boxminus: "⊟",
                boxplus: "⊞",
                boxtimes: "⊠",
                boxUL: "╝",
                boxUl: "╜",
                boxuL: "╛",
                boxul: "┘",
                boxUR: "╚",
                boxUr: "╙",
                boxuR: "╘",
                boxur: "└",
                boxV: "║",
                boxv: "│",
                boxVH: "╬",
                boxVh: "╫",
                boxvH: "╪",
                boxvh: "┼",
                boxVL: "╣",
                boxVl: "╢",
                boxvL: "╡",
                boxvl: "┤",
                boxVR: "╠",
                boxVr: "╟",
                boxvR: "╞",
                boxvr: "├",
                bprime: "‵",
                Breve: "˘",
                breve: "˘",
                brvbar: "¦",
                Bscr: "ℬ",
                bscr: "𝒷",
                bsemi: "⁏",
                bsim: "∽",
                bsime: "⋍",
                bsol: "\\",
                bsolb: "⧅",
                bsolhsub: "⟈",
                bull: "•",
                bullet: "•",
                bump: "≎",
                bumpE: "⪮",
                bumpe: "≏",
                Bumpeq: "≎",
                bumpeq: "≏",
                Cacute: "Ć",
                cacute: "ć",
                Cap: "⋒",
                cap: "∩",
                capand: "⩄",
                capbrcup: "⩉",
                capcap: "⩋",
                capcup: "⩇",
                capdot: "⩀",
                CapitalDifferentialD: "ⅅ",
                caps: "∩︀",
                caret: "⁁",
                caron: "ˇ",
                Cayleys: "ℭ",
                ccaps: "⩍",
                Ccaron: "Č",
                ccaron: "č",
                Ccedil: "Ç",
                ccedil: "ç",
                Ccirc: "Ĉ",
                ccirc: "ĉ",
                Cconint: "∰",
                ccups: "⩌",
                ccupssm: "⩐",
                Cdot: "Ċ",
                cdot: "ċ",
                cedil: "¸",
                Cedilla: "¸",
                cemptyv: "⦲",
                cent: "¢",
                CenterDot: "·",
                centerdot: "·",
                Cfr: "ℭ",
                cfr: "𝔠",
                CHcy: "Ч",
                chcy: "ч",
                check: "✓",
                checkmark: "✓",
                Chi: "Χ",
                chi: "χ",
                cir: "○",
                circ: "ˆ",
                circeq: "≗",
                circlearrowleft: "↺",
                circlearrowright: "↻",
                circledast: "⊛",
                circledcirc: "⊚",
                circleddash: "⊝",
                CircleDot: "⊙",
                circledR: "®",
                circledS: "Ⓢ",
                CircleMinus: "⊖",
                CirclePlus: "⊕",
                CircleTimes: "⊗",
                cirE: "⧃",
                cire: "≗",
                cirfnint: "⨐",
                cirmid: "⫯",
                cirscir: "⧂",
                ClockwiseContourIntegral: "∲",
                CloseCurlyDoubleQuote: "”",
                CloseCurlyQuote: "’",
                clubs: "♣",
                clubsuit: "♣",
                Colon: "∷",
                colon: ":",
                Colone: "⩴",
                colone: "≔",
                coloneq: "≔",
                comma: ",",
                commat: "@",
                comp: "∁",
                compfn: "∘",
                complement: "∁",
                complexes: "ℂ",
                cong: "≅",
                congdot: "⩭",
                Congruent: "≡",
                Conint: "∯",
                conint: "∮",
                ContourIntegral: "∮",
                Copf: "ℂ",
                copf: "𝕔",
                coprod: "∐",
                Coproduct: "∐",
                COPY: "©",
                copy: "©",
                copysr: "℗",
                CounterClockwiseContourIntegral: "∳",
                crarr: "↵",
                Cross: "⨯",
                cross: "✗",
                Cscr: "𝒞",
                cscr: "𝒸",
                csub: "⫏",
                csube: "⫑",
                csup: "⫐",
                csupe: "⫒",
                ctdot: "⋯",
                cudarrl: "⤸",
                cudarrr: "⤵",
                cuepr: "⋞",
                cuesc: "⋟",
                cularr: "↶",
                cularrp: "⤽",
                Cup: "⋓",
                cup: "∪",
                cupbrcap: "⩈",
                CupCap: "≍",
                cupcap: "⩆",
                cupcup: "⩊",
                cupdot: "⊍",
                cupor: "⩅",
                cups: "∪︀",
                curarr: "↷",
                curarrm: "⤼",
                curlyeqprec: "⋞",
                curlyeqsucc: "⋟",
                curlyvee: "⋎",
                curlywedge: "⋏",
                curren: "¤",
                curvearrowleft: "↶",
                curvearrowright: "↷",
                cuvee: "⋎",
                cuwed: "⋏",
                cwconint: "∲",
                cwint: "∱",
                cylcty: "⌭",
                Dagger: "‡",
                dagger: "†",
                daleth: "ℸ",
                Darr: "↡",
                dArr: "⇓",
                darr: "↓",
                dash: "‐",
                Dashv: "⫤",
                dashv: "⊣",
                dbkarow: "⤏",
                dblac: "˝",
                Dcaron: "Ď",
                dcaron: "ď",
                Dcy: "Д",
                dcy: "д",
                DD: "ⅅ",
                dd: "ⅆ",
                ddagger: "‡",
                ddarr: "⇊",
                DDotrahd: "⤑",
                ddotseq: "⩷",
                deg: "°",
                Del: "∇",
                Delta: "Δ",
                delta: "δ",
                demptyv: "⦱",
                dfisht: "⥿",
                Dfr: "𝔇",
                dfr: "𝔡",
                dHar: "⥥",
                dharl: "⇃",
                dharr: "⇂",
                DiacriticalAcute: "´",
                DiacriticalDot: "˙",
                DiacriticalDoubleAcute: "˝",
                DiacriticalGrave: "`",
                DiacriticalTilde: "˜",
                diam: "⋄",
                Diamond: "⋄",
                diamond: "⋄",
                diamondsuit: "♦",
                diams: "♦",
                die: "¨",
                DifferentialD: "ⅆ",
                digamma: "ϝ",
                disin: "⋲",
                div: "÷",
                divide: "÷",
                divideontimes: "⋇",
                divonx: "⋇",
                DJcy: "Ђ",
                djcy: "ђ",
                dlcorn: "⌞",
                dlcrop: "⌍",
                dollar: "$",
                Dopf: "𝔻",
                dopf: "𝕕",
                Dot: "¨",
                dot: "˙",
                DotDot: "⃜",
                doteq: "≐",
                doteqdot: "≑",
                DotEqual: "≐",
                dotminus: "∸",
                dotplus: "∔",
                dotsquare: "⊡",
                doublebarwedge: "⌆",
                DoubleContourIntegral: "∯",
                DoubleDot: "¨",
                DoubleDownArrow: "⇓",
                DoubleLeftArrow: "⇐",
                DoubleLeftRightArrow: "⇔",
                DoubleLeftTee: "⫤",
                DoubleLongLeftArrow: "⟸",
                DoubleLongLeftRightArrow: "⟺",
                DoubleLongRightArrow: "⟹",
                DoubleRightArrow: "⇒",
                DoubleRightTee: "⊨",
                DoubleUpArrow: "⇑",
                DoubleUpDownArrow: "⇕",
                DoubleVerticalBar: "∥",
                DownArrow: "↓",
                Downarrow: "⇓",
                downarrow: "↓",
                DownArrowBar: "⤓",
                DownArrowUpArrow: "⇵",
                DownBreve: "̑",
                downdownarrows: "⇊",
                downharpoonleft: "⇃",
                downharpoonright: "⇂",
                DownLeftRightVector: "⥐",
                DownLeftTeeVector: "⥞",
                DownLeftVector: "↽",
                DownLeftVectorBar: "⥖",
                DownRightTeeVector: "⥟",
                DownRightVector: "⇁",
                DownRightVectorBar: "⥗",
                DownTee: "⊤",
                DownTeeArrow: "↧",
                drbkarow: "⤐",
                drcorn: "⌟",
                drcrop: "⌌",
                Dscr: "𝒟",
                dscr: "𝒹",
                DScy: "Ѕ",
                dscy: "ѕ",
                dsol: "⧶",
                Dstrok: "Đ",
                dstrok: "đ",
                dtdot: "⋱",
                dtri: "▿",
                dtrif: "▾",
                duarr: "⇵",
                duhar: "⥯",
                dwangle: "⦦",
                DZcy: "Џ",
                dzcy: "џ",
                dzigrarr: "⟿",
                Eacute: "É",
                eacute: "é",
                easter: "⩮",
                Ecaron: "Ě",
                ecaron: "ě",
                ecir: "≖",
                Ecirc: "Ê",
                ecirc: "ê",
                ecolon: "≕",
                Ecy: "Э",
                ecy: "э",
                eDDot: "⩷",
                Edot: "Ė",
                eDot: "≑",
                edot: "ė",
                ee: "ⅇ",
                efDot: "≒",
                Efr: "𝔈",
                efr: "𝔢",
                eg: "⪚",
                Egrave: "È",
                egrave: "è",
                egs: "⪖",
                egsdot: "⪘",
                el: "⪙",
                Element: "∈",
                elinters: "⏧",
                ell: "ℓ",
                els: "⪕",
                elsdot: "⪗",
                Emacr: "Ē",
                emacr: "ē",
                empty: "∅",
                emptyset: "∅",
                EmptySmallSquare: "◻",
                emptyv: "∅",
                EmptyVerySmallSquare: "▫",
                emsp: " ",
                emsp13: " ",
                emsp14: " ",
                ENG: "Ŋ",
                eng: "ŋ",
                ensp: " ",
                Eogon: "Ę",
                eogon: "ę",
                Eopf: "𝔼",
                eopf: "𝕖",
                epar: "⋕",
                eparsl: "⧣",
                eplus: "⩱",
                epsi: "ε",
                Epsilon: "Ε",
                epsilon: "ε",
                epsiv: "ϵ",
                eqcirc: "≖",
                eqcolon: "≕",
                eqsim: "≂",
                eqslantgtr: "⪖",
                eqslantless: "⪕",
                Equal: "⩵",
                equals: "=",
                EqualTilde: "≂",
                equest: "≟",
                Equilibrium: "⇌",
                equiv: "≡",
                equivDD: "⩸",
                eqvparsl: "⧥",
                erarr: "⥱",
                erDot: "≓",
                Escr: "ℰ",
                escr: "ℯ",
                esdot: "≐",
                Esim: "⩳",
                esim: "≂",
                Eta: "Η",
                eta: "η",
                ETH: "Ð",
                eth: "ð",
                Euml: "Ë",
                euml: "ë",
                euro: "€",
                excl: "!",
                exist: "∃",
                Exists: "∃",
                expectation: "ℰ",
                ExponentialE: "ⅇ",
                exponentiale: "ⅇ",
                fallingdotseq: "≒",
                Fcy: "Ф",
                fcy: "ф",
                female: "♀",
                ffilig: "ﬃ",
                fflig: "ﬀ",
                ffllig: "ﬄ",
                Ffr: "𝔉",
                ffr: "𝔣",
                filig: "ﬁ",
                FilledSmallSquare: "◼",
                FilledVerySmallSquare: "▪",
                fjlig: "fj",
                flat: "♭",
                fllig: "ﬂ",
                fltns: "▱",
                fnof: "ƒ",
                Fopf: "𝔽",
                fopf: "𝕗",
                ForAll: "∀",
                forall: "∀",
                fork: "⋔",
                forkv: "⫙",
                Fouriertrf: "ℱ",
                fpartint: "⨍",
                frac12: "½",
                frac13: "⅓",
                frac14: "¼",
                frac15: "⅕",
                frac16: "⅙",
                frac18: "⅛",
                frac23: "⅔",
                frac25: "⅖",
                frac34: "¾",
                frac35: "⅗",
                frac38: "⅜",
                frac45: "⅘",
                frac56: "⅚",
                frac58: "⅝",
                frac78: "⅞",
                frasl: "⁄",
                frown: "⌢",
                Fscr: "ℱ",
                fscr: "𝒻",
                gacute: "ǵ",
                Gamma: "Γ",
                gamma: "γ",
                Gammad: "Ϝ",
                gammad: "ϝ",
                gap: "⪆",
                Gbreve: "Ğ",
                gbreve: "ğ",
                Gcedil: "Ģ",
                Gcirc: "Ĝ",
                gcirc: "ĝ",
                Gcy: "Г",
                gcy: "г",
                Gdot: "Ġ",
                gdot: "ġ",
                gE: "≧",
                ge: "≥",
                gEl: "⪌",
                gel: "⋛",
                geq: "≥",
                geqq: "≧",
                geqslant: "⩾",
                ges: "⩾",
                gescc: "⪩",
                gesdot: "⪀",
                gesdoto: "⪂",
                gesdotol: "⪄",
                gesl: "⋛︀",
                gesles: "⪔",
                Gfr: "𝔊",
                gfr: "𝔤",
                Gg: "⋙",
                gg: "≫",
                ggg: "⋙",
                gimel: "ℷ",
                GJcy: "Ѓ",
                gjcy: "ѓ",
                gl: "≷",
                gla: "⪥",
                glE: "⪒",
                glj: "⪤",
                gnap: "⪊",
                gnapprox: "⪊",
                gnE: "≩",
                gne: "⪈",
                gneq: "⪈",
                gneqq: "≩",
                gnsim: "⋧",
                Gopf: "𝔾",
                gopf: "𝕘",
                grave: "`",
                GreaterEqual: "≥",
                GreaterEqualLess: "⋛",
                GreaterFullEqual: "≧",
                GreaterGreater: "⪢",
                GreaterLess: "≷",
                GreaterSlantEqual: "⩾",
                GreaterTilde: "≳",
                Gscr: "𝒢",
                gscr: "ℊ",
                gsim: "≳",
                gsime: "⪎",
                gsiml: "⪐",
                GT: ">",
                Gt: "≫",
                gt: ">",
                gtcc: "⪧",
                gtcir: "⩺",
                gtdot: "⋗",
                gtlPar: "⦕",
                gtquest: "⩼",
                gtrapprox: "⪆",
                gtrarr: "⥸",
                gtrdot: "⋗",
                gtreqless: "⋛",
                gtreqqless: "⪌",
                gtrless: "≷",
                gtrsim: "≳",
                gvertneqq: "≩︀",
                gvnE: "≩︀",
                Hacek: "ˇ",
                hairsp: " ",
                half: "½",
                hamilt: "ℋ",
                HARDcy: "Ъ",
                hardcy: "ъ",
                hArr: "⇔",
                harr: "↔",
                harrcir: "⥈",
                harrw: "↭",
                Hat: "^",
                hbar: "ℏ",
                Hcirc: "Ĥ",
                hcirc: "ĥ",
                hearts: "♥",
                heartsuit: "♥",
                hellip: "…",
                hercon: "⊹",
                Hfr: "ℌ",
                hfr: "𝔥",
                HilbertSpace: "ℋ",
                hksearow: "⤥",
                hkswarow: "⤦",
                hoarr: "⇿",
                homtht: "∻",
                hookleftarrow: "↩",
                hookrightarrow: "↪",
                Hopf: "ℍ",
                hopf: "𝕙",
                horbar: "―",
                HorizontalLine: "─",
                Hscr: "ℋ",
                hscr: "𝒽",
                hslash: "ℏ",
                Hstrok: "Ħ",
                hstrok: "ħ",
                HumpDownHump: "≎",
                HumpEqual: "≏",
                hybull: "⁃",
                hyphen: "‐",
                Iacute: "Í",
                iacute: "í",
                ic: "⁣",
                Icirc: "Î",
                icirc: "î",
                Icy: "И",
                icy: "и",
                Idot: "İ",
                IEcy: "Е",
                iecy: "е",
                iexcl: "¡",
                iff: "⇔",
                Ifr: "ℑ",
                ifr: "𝔦",
                Igrave: "Ì",
                igrave: "ì",
                ii: "ⅈ",
                iiiint: "⨌",
                iiint: "∭",
                iinfin: "⧜",
                iiota: "℩",
                IJlig: "Ĳ",
                ijlig: "ĳ",
                Im: "ℑ",
                Imacr: "Ī",
                imacr: "ī",
                image: "ℑ",
                ImaginaryI: "ⅈ",
                imagline: "ℐ",
                imagpart: "ℑ",
                imath: "ı",
                imof: "⊷",
                imped: "Ƶ",
                Implies: "⇒",
                in: "∈",
                incare: "℅",
                infin: "∞",
                infintie: "⧝",
                inodot: "ı",
                Int: "∬",
                int: "∫",
                intcal: "⊺",
                integers: "ℤ",
                Integral: "∫",
                intercal: "⊺",
                Intersection: "⋂",
                intlarhk: "⨗",
                intprod: "⨼",
                InvisibleComma: "⁣",
                InvisibleTimes: "⁢",
                IOcy: "Ё",
                iocy: "ё",
                Iogon: "Į",
                iogon: "į",
                Iopf: "𝕀",
                iopf: "𝕚",
                Iota: "Ι",
                iota: "ι",
                iprod: "⨼",
                iquest: "¿",
                Iscr: "ℐ",
                iscr: "𝒾",
                isin: "∈",
                isindot: "⋵",
                isinE: "⋹",
                isins: "⋴",
                isinsv: "⋳",
                isinv: "∈",
                it: "⁢",
                Itilde: "Ĩ",
                itilde: "ĩ",
                Iukcy: "І",
                iukcy: "і",
                Iuml: "Ï",
                iuml: "ï",
                Jcirc: "Ĵ",
                jcirc: "ĵ",
                Jcy: "Й",
                jcy: "й",
                Jfr: "𝔍",
                jfr: "𝔧",
                jmath: "ȷ",
                Jopf: "𝕁",
                jopf: "𝕛",
                Jscr: "𝒥",
                jscr: "𝒿",
                Jsercy: "Ј",
                jsercy: "ј",
                Jukcy: "Є",
                jukcy: "є",
                Kappa: "Κ",
                kappa: "κ",
                kappav: "ϰ",
                Kcedil: "Ķ",
                kcedil: "ķ",
                Kcy: "К",
                kcy: "к",
                Kfr: "𝔎",
                kfr: "𝔨",
                kgreen: "ĸ",
                KHcy: "Х",
                khcy: "х",
                KJcy: "Ќ",
                kjcy: "ќ",
                Kopf: "𝕂",
                kopf: "𝕜",
                Kscr: "𝒦",
                kscr: "𝓀",
                lAarr: "⇚",
                Lacute: "Ĺ",
                lacute: "ĺ",
                laemptyv: "⦴",
                lagran: "ℒ",
                Lambda: "Λ",
                lambda: "λ",
                Lang: "⟪",
                lang: "⟨",
                langd: "⦑",
                langle: "⟨",
                lap: "⪅",
                Laplacetrf: "ℒ",
                laquo: "«",
                Larr: "↞",
                lArr: "⇐",
                larr: "←",
                larrb: "⇤",
                larrbfs: "⤟",
                larrfs: "⤝",
                larrhk: "↩",
                larrlp: "↫",
                larrpl: "⤹",
                larrsim: "⥳",
                larrtl: "↢",
                lat: "⪫",
                lAtail: "⤛",
                latail: "⤙",
                late: "⪭",
                lates: "⪭︀",
                lBarr: "⤎",
                lbarr: "⤌",
                lbbrk: "❲",
                lbrace: "{",
                lbrack: "[",
                lbrke: "⦋",
                lbrksld: "⦏",
                lbrkslu: "⦍",
                Lcaron: "Ľ",
                lcaron: "ľ",
                Lcedil: "Ļ",
                lcedil: "ļ",
                lceil: "⌈",
                lcub: "{",
                Lcy: "Л",
                lcy: "л",
                ldca: "⤶",
                ldquo: "“",
                ldquor: "„",
                ldrdhar: "⥧",
                ldrushar: "⥋",
                ldsh: "↲",
                lE: "≦",
                le: "≤",
                LeftAngleBracket: "⟨",
                LeftArrow: "←",
                Leftarrow: "⇐",
                leftarrow: "←",
                LeftArrowBar: "⇤",
                LeftArrowRightArrow: "⇆",
                leftarrowtail: "↢",
                LeftCeiling: "⌈",
                LeftDoubleBracket: "⟦",
                LeftDownTeeVector: "⥡",
                LeftDownVector: "⇃",
                LeftDownVectorBar: "⥙",
                LeftFloor: "⌊",
                leftharpoondown: "↽",
                leftharpoonup: "↼",
                leftleftarrows: "⇇",
                LeftRightArrow: "↔",
                Leftrightarrow: "⇔",
                leftrightarrow: "↔",
                leftrightarrows: "⇆",
                leftrightharpoons: "⇋",
                leftrightsquigarrow: "↭",
                LeftRightVector: "⥎",
                LeftTee: "⊣",
                LeftTeeArrow: "↤",
                LeftTeeVector: "⥚",
                leftthreetimes: "⋋",
                LeftTriangle: "⊲",
                LeftTriangleBar: "⧏",
                LeftTriangleEqual: "⊴",
                LeftUpDownVector: "⥑",
                LeftUpTeeVector: "⥠",
                LeftUpVector: "↿",
                LeftUpVectorBar: "⥘",
                LeftVector: "↼",
                LeftVectorBar: "⥒",
                lEg: "⪋",
                leg: "⋚",
                leq: "≤",
                leqq: "≦",
                leqslant: "⩽",
                les: "⩽",
                lescc: "⪨",
                lesdot: "⩿",
                lesdoto: "⪁",
                lesdotor: "⪃",
                lesg: "⋚︀",
                lesges: "⪓",
                lessapprox: "⪅",
                lessdot: "⋖",
                lesseqgtr: "⋚",
                lesseqqgtr: "⪋",
                LessEqualGreater: "⋚",
                LessFullEqual: "≦",
                LessGreater: "≶",
                lessgtr: "≶",
                LessLess: "⪡",
                lesssim: "≲",
                LessSlantEqual: "⩽",
                LessTilde: "≲",
                lfisht: "⥼",
                lfloor: "⌊",
                Lfr: "𝔏",
                lfr: "𝔩",
                lg: "≶",
                lgE: "⪑",
                lHar: "⥢",
                lhard: "↽",
                lharu: "↼",
                lharul: "⥪",
                lhblk: "▄",
                LJcy: "Љ",
                ljcy: "љ",
                Ll: "⋘",
                ll: "≪",
                llarr: "⇇",
                llcorner: "⌞",
                Lleftarrow: "⇚",
                llhard: "⥫",
                lltri: "◺",
                Lmidot: "Ŀ",
                lmidot: "ŀ",
                lmoust: "⎰",
                lmoustache: "⎰",
                lnap: "⪉",
                lnapprox: "⪉",
                lnE: "≨",
                lne: "⪇",
                lneq: "⪇",
                lneqq: "≨",
                lnsim: "⋦",
                loang: "⟬",
                loarr: "⇽",
                lobrk: "⟦",
                LongLeftArrow: "⟵",
                Longleftarrow: "⟸",
                longleftarrow: "⟵",
                LongLeftRightArrow: "⟷",
                Longleftrightarrow: "⟺",
                longleftrightarrow: "⟷",
                longmapsto: "⟼",
                LongRightArrow: "⟶",
                Longrightarrow: "⟹",
                longrightarrow: "⟶",
                looparrowleft: "↫",
                looparrowright: "↬",
                lopar: "⦅",
                Lopf: "𝕃",
                lopf: "𝕝",
                loplus: "⨭",
                lotimes: "⨴",
                lowast: "∗",
                lowbar: "_",
                LowerLeftArrow: "↙",
                LowerRightArrow: "↘",
                loz: "◊",
                lozenge: "◊",
                lozf: "⧫",
                lpar: "(",
                lparlt: "⦓",
                lrarr: "⇆",
                lrcorner: "⌟",
                lrhar: "⇋",
                lrhard: "⥭",
                lrm: "‎",
                lrtri: "⊿",
                lsaquo: "‹",
                Lscr: "ℒ",
                lscr: "𝓁",
                Lsh: "↰",
                lsh: "↰",
                lsim: "≲",
                lsime: "⪍",
                lsimg: "⪏",
                lsqb: "[",
                lsquo: "‘",
                lsquor: "‚",
                Lstrok: "Ł",
                lstrok: "ł",
                LT: "<",
                Lt: "≪",
                lt: "<",
                ltcc: "⪦",
                ltcir: "⩹",
                ltdot: "⋖",
                lthree: "⋋",
                ltimes: "⋉",
                ltlarr: "⥶",
                ltquest: "⩻",
                ltri: "◃",
                ltrie: "⊴",
                ltrif: "◂",
                ltrPar: "⦖",
                lurdshar: "⥊",
                luruhar: "⥦",
                lvertneqq: "≨︀",
                lvnE: "≨︀",
                macr: "¯",
                male: "♂",
                malt: "✠",
                maltese: "✠",
                Map: "⤅",
                map: "↦",
                mapsto: "↦",
                mapstodown: "↧",
                mapstoleft: "↤",
                mapstoup: "↥",
                marker: "▮",
                mcomma: "⨩",
                Mcy: "М",
                mcy: "м",
                mdash: "—",
                mDDot: "∺",
                measuredangle: "∡",
                MediumSpace: " ",
                Mellintrf: "ℳ",
                Mfr: "𝔐",
                mfr: "𝔪",
                mho: "℧",
                micro: "µ",
                mid: "∣",
                midast: "*",
                midcir: "⫰",
                middot: "·",
                minus: "−",
                minusb: "⊟",
                minusd: "∸",
                minusdu: "⨪",
                MinusPlus: "∓",
                mlcp: "⫛",
                mldr: "…",
                mnplus: "∓",
                models: "⊧",
                Mopf: "𝕄",
                mopf: "𝕞",
                mp: "∓",
                Mscr: "ℳ",
                mscr: "𝓂",
                mstpos: "∾",
                Mu: "Μ",
                mu: "μ",
                multimap: "⊸",
                mumap: "⊸",
                nabla: "∇",
                Nacute: "Ń",
                nacute: "ń",
                nang: "∠⃒",
                nap: "≉",
                napE: "⩰̸",
                napid: "≋̸",
                napos: "ŉ",
                napprox: "≉",
                natur: "♮",
                natural: "♮",
                naturals: "ℕ",
                nbsp: " ",
                nbump: "≎̸",
                nbumpe: "≏̸",
                ncap: "⩃",
                Ncaron: "Ň",
                ncaron: "ň",
                Ncedil: "Ņ",
                ncedil: "ņ",
                ncong: "≇",
                ncongdot: "⩭̸",
                ncup: "⩂",
                Ncy: "Н",
                ncy: "н",
                ndash: "–",
                ne: "≠",
                nearhk: "⤤",
                neArr: "⇗",
                nearr: "↗",
                nearrow: "↗",
                nedot: "≐̸",
                NegativeMediumSpace: "​",
                NegativeThickSpace: "​",
                NegativeThinSpace: "​",
                NegativeVeryThinSpace: "​",
                nequiv: "≢",
                nesear: "⤨",
                nesim: "≂̸",
                NestedGreaterGreater: "≫",
                NestedLessLess: "≪",
                NewLine: "\n",
                nexist: "∄",
                nexists: "∄",
                Nfr: "𝔑",
                nfr: "𝔫",
                ngE: "≧̸",
                nge: "≱",
                ngeq: "≱",
                ngeqq: "≧̸",
                ngeqslant: "⩾̸",
                nges: "⩾̸",
                nGg: "⋙̸",
                ngsim: "≵",
                nGt: "≫⃒",
                ngt: "≯",
                ngtr: "≯",
                nGtv: "≫̸",
                nhArr: "⇎",
                nharr: "↮",
                nhpar: "⫲",
                ni: "∋",
                nis: "⋼",
                nisd: "⋺",
                niv: "∋",
                NJcy: "Њ",
                njcy: "њ",
                nlArr: "⇍",
                nlarr: "↚",
                nldr: "‥",
                nlE: "≦̸",
                nle: "≰",
                nLeftarrow: "⇍",
                nleftarrow: "↚",
                nLeftrightarrow: "⇎",
                nleftrightarrow: "↮",
                nleq: "≰",
                nleqq: "≦̸",
                nleqslant: "⩽̸",
                nles: "⩽̸",
                nless: "≮",
                nLl: "⋘̸",
                nlsim: "≴",
                nLt: "≪⃒",
                nlt: "≮",
                nltri: "⋪",
                nltrie: "⋬",
                nLtv: "≪̸",
                nmid: "∤",
                NoBreak: "⁠",
                NonBreakingSpace: " ",
                Nopf: "ℕ",
                nopf: "𝕟",
                Not: "⫬",
                not: "¬",
                NotCongruent: "≢",
                NotCupCap: "≭",
                NotDoubleVerticalBar: "∦",
                NotElement: "∉",
                NotEqual: "≠",
                NotEqualTilde: "≂̸",
                NotExists: "∄",
                NotGreater: "≯",
                NotGreaterEqual: "≱",
                NotGreaterFullEqual: "≧̸",
                NotGreaterGreater: "≫̸",
                NotGreaterLess: "≹",
                NotGreaterSlantEqual: "⩾̸",
                NotGreaterTilde: "≵",
                NotHumpDownHump: "≎̸",
                NotHumpEqual: "≏̸",
                notin: "∉",
                notindot: "⋵̸",
                notinE: "⋹̸",
                notinva: "∉",
                notinvb: "⋷",
                notinvc: "⋶",
                NotLeftTriangle: "⋪",
                NotLeftTriangleBar: "⧏̸",
                NotLeftTriangleEqual: "⋬",
                NotLess: "≮",
                NotLessEqual: "≰",
                NotLessGreater: "≸",
                NotLessLess: "≪̸",
                NotLessSlantEqual: "⩽̸",
                NotLessTilde: "≴",
                NotNestedGreaterGreater: "⪢̸",
                NotNestedLessLess: "⪡̸",
                notni: "∌",
                notniva: "∌",
                notnivb: "⋾",
                notnivc: "⋽",
                NotPrecedes: "⊀",
                NotPrecedesEqual: "⪯̸",
                NotPrecedesSlantEqual: "⋠",
                NotReverseElement: "∌",
                NotRightTriangle: "⋫",
                NotRightTriangleBar: "⧐̸",
                NotRightTriangleEqual: "⋭",
                NotSquareSubset: "⊏̸",
                NotSquareSubsetEqual: "⋢",
                NotSquareSuperset: "⊐̸",
                NotSquareSupersetEqual: "⋣",
                NotSubset: "⊂⃒",
                NotSubsetEqual: "⊈",
                NotSucceeds: "⊁",
                NotSucceedsEqual: "⪰̸",
                NotSucceedsSlantEqual: "⋡",
                NotSucceedsTilde: "≿̸",
                NotSuperset: "⊃⃒",
                NotSupersetEqual: "⊉",
                NotTilde: "≁",
                NotTildeEqual: "≄",
                NotTildeFullEqual: "≇",
                NotTildeTilde: "≉",
                NotVerticalBar: "∤",
                npar: "∦",
                nparallel: "∦",
                nparsl: "⫽⃥",
                npart: "∂̸",
                npolint: "⨔",
                npr: "⊀",
                nprcue: "⋠",
                npre: "⪯̸",
                nprec: "⊀",
                npreceq: "⪯̸",
                nrArr: "⇏",
                nrarr: "↛",
                nrarrc: "⤳̸",
                nrarrw: "↝̸",
                nRightarrow: "⇏",
                nrightarrow: "↛",
                nrtri: "⋫",
                nrtrie: "⋭",
                nsc: "⊁",
                nsccue: "⋡",
                nsce: "⪰̸",
                Nscr: "𝒩",
                nscr: "𝓃",
                nshortmid: "∤",
                nshortparallel: "∦",
                nsim: "≁",
                nsime: "≄",
                nsimeq: "≄",
                nsmid: "∤",
                nspar: "∦",
                nsqsube: "⋢",
                nsqsupe: "⋣",
                nsub: "⊄",
                nsubE: "⫅̸",
                nsube: "⊈",
                nsubset: "⊂⃒",
                nsubseteq: "⊈",
                nsubseteqq: "⫅̸",
                nsucc: "⊁",
                nsucceq: "⪰̸",
                nsup: "⊅",
                nsupE: "⫆̸",
                nsupe: "⊉",
                nsupset: "⊃⃒",
                nsupseteq: "⊉",
                nsupseteqq: "⫆̸",
                ntgl: "≹",
                Ntilde: "Ñ",
                ntilde: "ñ",
                ntlg: "≸",
                ntriangleleft: "⋪",
                ntrianglelefteq: "⋬",
                ntriangleright: "⋫",
                ntrianglerighteq: "⋭",
                Nu: "Ν",
                nu: "ν",
                num: "#",
                numero: "№",
                numsp: " ",
                nvap: "≍⃒",
                nVDash: "⊯",
                nVdash: "⊮",
                nvDash: "⊭",
                nvdash: "⊬",
                nvge: "≥⃒",
                nvgt: ">⃒",
                nvHarr: "⤄",
                nvinfin: "⧞",
                nvlArr: "⤂",
                nvle: "≤⃒",
                nvlt: "<⃒",
                nvltrie: "⊴⃒",
                nvrArr: "⤃",
                nvrtrie: "⊵⃒",
                nvsim: "∼⃒",
                nwarhk: "⤣",
                nwArr: "⇖",
                nwarr: "↖",
                nwarrow: "↖",
                nwnear: "⤧",
                Oacute: "Ó",
                oacute: "ó",
                oast: "⊛",
                ocir: "⊚",
                Ocirc: "Ô",
                ocirc: "ô",
                Ocy: "О",
                ocy: "о",
                odash: "⊝",
                Odblac: "Ő",
                odblac: "ő",
                odiv: "⨸",
                odot: "⊙",
                odsold: "⦼",
                OElig: "Œ",
                oelig: "œ",
                ofcir: "⦿",
                Ofr: "𝔒",
                ofr: "𝔬",
                ogon: "˛",
                Ograve: "Ò",
                ograve: "ò",
                ogt: "⧁",
                ohbar: "⦵",
                ohm: "Ω",
                oint: "∮",
                olarr: "↺",
                olcir: "⦾",
                olcross: "⦻",
                oline: "‾",
                olt: "⧀",
                Omacr: "Ō",
                omacr: "ō",
                Omega: "Ω",
                omega: "ω",
                Omicron: "Ο",
                omicron: "ο",
                omid: "⦶",
                ominus: "⊖",
                Oopf: "𝕆",
                oopf: "𝕠",
                opar: "⦷",
                OpenCurlyDoubleQuote: "“",
                OpenCurlyQuote: "‘",
                operp: "⦹",
                oplus: "⊕",
                Or: "⩔",
                or: "∨",
                orarr: "↻",
                ord: "⩝",
                order: "ℴ",
                orderof: "ℴ",
                ordf: "ª",
                ordm: "º",
                origof: "⊶",
                oror: "⩖",
                orslope: "⩗",
                orv: "⩛",
                oS: "Ⓢ",
                Oscr: "𝒪",
                oscr: "ℴ",
                Oslash: "Ø",
                oslash: "ø",
                osol: "⊘",
                Otilde: "Õ",
                otilde: "õ",
                Otimes: "⨷",
                otimes: "⊗",
                otimesas: "⨶",
                Ouml: "Ö",
                ouml: "ö",
                ovbar: "⌽",
                OverBar: "‾",
                OverBrace: "⏞",
                OverBracket: "⎴",
                OverParenthesis: "⏜",
                par: "∥",
                para: "¶",
                parallel: "∥",
                parsim: "⫳",
                parsl: "⫽",
                part: "∂",
                PartialD: "∂",
                Pcy: "П",
                pcy: "п",
                percnt: "%",
                period: ".",
                permil: "‰",
                perp: "⊥",
                pertenk: "‱",
                Pfr: "𝔓",
                pfr: "𝔭",
                Phi: "Φ",
                phi: "φ",
                phiv: "ϕ",
                phmmat: "ℳ",
                phone: "☎",
                Pi: "Π",
                pi: "π",
                pitchfork: "⋔",
                piv: "ϖ",
                planck: "ℏ",
                planckh: "ℎ",
                plankv: "ℏ",
                plus: "+",
                plusacir: "⨣",
                plusb: "⊞",
                pluscir: "⨢",
                plusdo: "∔",
                plusdu: "⨥",
                pluse: "⩲",
                PlusMinus: "±",
                plusmn: "±",
                plussim: "⨦",
                plustwo: "⨧",
                pm: "±",
                Poincareplane: "ℌ",
                pointint: "⨕",
                Popf: "ℙ",
                popf: "𝕡",
                pound: "£",
                Pr: "⪻",
                pr: "≺",
                prap: "⪷",
                prcue: "≼",
                prE: "⪳",
                pre: "⪯",
                prec: "≺",
                precapprox: "⪷",
                preccurlyeq: "≼",
                Precedes: "≺",
                PrecedesEqual: "⪯",
                PrecedesSlantEqual: "≼",
                PrecedesTilde: "≾",
                preceq: "⪯",
                precnapprox: "⪹",
                precneqq: "⪵",
                precnsim: "⋨",
                precsim: "≾",
                Prime: "″",
                prime: "′",
                primes: "ℙ",
                prnap: "⪹",
                prnE: "⪵",
                prnsim: "⋨",
                prod: "∏",
                Product: "∏",
                profalar: "⌮",
                profline: "⌒",
                profsurf: "⌓",
                prop: "∝",
                Proportion: "∷",
                Proportional: "∝",
                propto: "∝",
                prsim: "≾",
                prurel: "⊰",
                Pscr: "𝒫",
                pscr: "𝓅",
                Psi: "Ψ",
                psi: "ψ",
                puncsp: " ",
                Qfr: "𝔔",
                qfr: "𝔮",
                qint: "⨌",
                Qopf: "ℚ",
                qopf: "𝕢",
                qprime: "⁗",
                Qscr: "𝒬",
                qscr: "𝓆",
                quaternions: "ℍ",
                quatint: "⨖",
                quest: "?",
                questeq: "≟",
                QUOT: '"',
                quot: '"',
                rAarr: "⇛",
                race: "∽̱",
                Racute: "Ŕ",
                racute: "ŕ",
                radic: "√",
                raemptyv: "⦳",
                Rang: "⟫",
                rang: "⟩",
                rangd: "⦒",
                range: "⦥",
                rangle: "⟩",
                raquo: "»",
                Rarr: "↠",
                rArr: "⇒",
                rarr: "→",
                rarrap: "⥵",
                rarrb: "⇥",
                rarrbfs: "⤠",
                rarrc: "⤳",
                rarrfs: "⤞",
                rarrhk: "↪",
                rarrlp: "↬",
                rarrpl: "⥅",
                rarrsim: "⥴",
                Rarrtl: "⤖",
                rarrtl: "↣",
                rarrw: "↝",
                rAtail: "⤜",
                ratail: "⤚",
                ratio: "∶",
                rationals: "ℚ",
                RBarr: "⤐",
                rBarr: "⤏",
                rbarr: "⤍",
                rbbrk: "❳",
                rbrace: "}",
                rbrack: "]",
                rbrke: "⦌",
                rbrksld: "⦎",
                rbrkslu: "⦐",
                Rcaron: "Ř",
                rcaron: "ř",
                Rcedil: "Ŗ",
                rcedil: "ŗ",
                rceil: "⌉",
                rcub: "}",
                Rcy: "Р",
                rcy: "р",
                rdca: "⤷",
                rdldhar: "⥩",
                rdquo: "”",
                rdquor: "”",
                rdsh: "↳",
                Re: "ℜ",
                real: "ℜ",
                realine: "ℛ",
                realpart: "ℜ",
                reals: "ℝ",
                rect: "▭",
                REG: "®",
                reg: "®",
                ReverseElement: "∋",
                ReverseEquilibrium: "⇋",
                ReverseUpEquilibrium: "⥯",
                rfisht: "⥽",
                rfloor: "⌋",
                Rfr: "ℜ",
                rfr: "𝔯",
                rHar: "⥤",
                rhard: "⇁",
                rharu: "⇀",
                rharul: "⥬",
                Rho: "Ρ",
                rho: "ρ",
                rhov: "ϱ",
                RightAngleBracket: "⟩",
                RightArrow: "→",
                Rightarrow: "⇒",
                rightarrow: "→",
                RightArrowBar: "⇥",
                RightArrowLeftArrow: "⇄",
                rightarrowtail: "↣",
                RightCeiling: "⌉",
                RightDoubleBracket: "⟧",
                RightDownTeeVector: "⥝",
                RightDownVector: "⇂",
                RightDownVectorBar: "⥕",
                RightFloor: "⌋",
                rightharpoondown: "⇁",
                rightharpoonup: "⇀",
                rightleftarrows: "⇄",
                rightleftharpoons: "⇌",
                rightrightarrows: "⇉",
                rightsquigarrow: "↝",
                RightTee: "⊢",
                RightTeeArrow: "↦",
                RightTeeVector: "⥛",
                rightthreetimes: "⋌",
                RightTriangle: "⊳",
                RightTriangleBar: "⧐",
                RightTriangleEqual: "⊵",
                RightUpDownVector: "⥏",
                RightUpTeeVector: "⥜",
                RightUpVector: "↾",
                RightUpVectorBar: "⥔",
                RightVector: "⇀",
                RightVectorBar: "⥓",
                ring: "˚",
                risingdotseq: "≓",
                rlarr: "⇄",
                rlhar: "⇌",
                rlm: "‏",
                rmoust: "⎱",
                rmoustache: "⎱",
                rnmid: "⫮",
                roang: "⟭",
                roarr: "⇾",
                robrk: "⟧",
                ropar: "⦆",
                Ropf: "ℝ",
                ropf: "𝕣",
                roplus: "⨮",
                rotimes: "⨵",
                RoundImplies: "⥰",
                rpar: ")",
                rpargt: "⦔",
                rppolint: "⨒",
                rrarr: "⇉",
                Rrightarrow: "⇛",
                rsaquo: "›",
                Rscr: "ℛ",
                rscr: "𝓇",
                Rsh: "↱",
                rsh: "↱",
                rsqb: "]",
                rsquo: "’",
                rsquor: "’",
                rthree: "⋌",
                rtimes: "⋊",
                rtri: "▹",
                rtrie: "⊵",
                rtrif: "▸",
                rtriltri: "⧎",
                RuleDelayed: "⧴",
                ruluhar: "⥨",
                rx: "℞",
                Sacute: "Ś",
                sacute: "ś",
                sbquo: "‚",
                Sc: "⪼",
                sc: "≻",
                scap: "⪸",
                Scaron: "Š",
                scaron: "š",
                sccue: "≽",
                scE: "⪴",
                sce: "⪰",
                Scedil: "Ş",
                scedil: "ş",
                Scirc: "Ŝ",
                scirc: "ŝ",
                scnap: "⪺",
                scnE: "⪶",
                scnsim: "⋩",
                scpolint: "⨓",
                scsim: "≿",
                Scy: "С",
                scy: "с",
                sdot: "⋅",
                sdotb: "⊡",
                sdote: "⩦",
                searhk: "⤥",
                seArr: "⇘",
                searr: "↘",
                searrow: "↘",
                sect: "§",
                semi: ";",
                seswar: "⤩",
                setminus: "∖",
                setmn: "∖",
                sext: "✶",
                Sfr: "𝔖",
                sfr: "𝔰",
                sfrown: "⌢",
                sharp: "♯",
                SHCHcy: "Щ",
                shchcy: "щ",
                SHcy: "Ш",
                shcy: "ш",
                ShortDownArrow: "↓",
                ShortLeftArrow: "←",
                shortmid: "∣",
                shortparallel: "∥",
                ShortRightArrow: "→",
                ShortUpArrow: "↑",
                shy: "­",
                Sigma: "Σ",
                sigma: "σ",
                sigmaf: "ς",
                sigmav: "ς",
                sim: "∼",
                simdot: "⩪",
                sime: "≃",
                simeq: "≃",
                simg: "⪞",
                simgE: "⪠",
                siml: "⪝",
                simlE: "⪟",
                simne: "≆",
                simplus: "⨤",
                simrarr: "⥲",
                slarr: "←",
                SmallCircle: "∘",
                smallsetminus: "∖",
                smashp: "⨳",
                smeparsl: "⧤",
                smid: "∣",
                smile: "⌣",
                smt: "⪪",
                smte: "⪬",
                smtes: "⪬︀",
                SOFTcy: "Ь",
                softcy: "ь",
                sol: "/",
                solb: "⧄",
                solbar: "⌿",
                Sopf: "𝕊",
                sopf: "𝕤",
                spades: "♠",
                spadesuit: "♠",
                spar: "∥",
                sqcap: "⊓",
                sqcaps: "⊓︀",
                sqcup: "⊔",
                sqcups: "⊔︀",
                Sqrt: "√",
                sqsub: "⊏",
                sqsube: "⊑",
                sqsubset: "⊏",
                sqsubseteq: "⊑",
                sqsup: "⊐",
                sqsupe: "⊒",
                sqsupset: "⊐",
                sqsupseteq: "⊒",
                squ: "□",
                Square: "□",
                square: "□",
                SquareIntersection: "⊓",
                SquareSubset: "⊏",
                SquareSubsetEqual: "⊑",
                SquareSuperset: "⊐",
                SquareSupersetEqual: "⊒",
                SquareUnion: "⊔",
                squarf: "▪",
                squf: "▪",
                srarr: "→",
                Sscr: "𝒮",
                sscr: "𝓈",
                ssetmn: "∖",
                ssmile: "⌣",
                sstarf: "⋆",
                Star: "⋆",
                star: "☆",
                starf: "★",
                straightepsilon: "ϵ",
                straightphi: "ϕ",
                strns: "¯",
                Sub: "⋐",
                sub: "⊂",
                subdot: "⪽",
                subE: "⫅",
                sube: "⊆",
                subedot: "⫃",
                submult: "⫁",
                subnE: "⫋",
                subne: "⊊",
                subplus: "⪿",
                subrarr: "⥹",
                Subset: "⋐",
                subset: "⊂",
                subseteq: "⊆",
                subseteqq: "⫅",
                SubsetEqual: "⊆",
                subsetneq: "⊊",
                subsetneqq: "⫋",
                subsim: "⫇",
                subsub: "⫕",
                subsup: "⫓",
                succ: "≻",
                succapprox: "⪸",
                succcurlyeq: "≽",
                Succeeds: "≻",
                SucceedsEqual: "⪰",
                SucceedsSlantEqual: "≽",
                SucceedsTilde: "≿",
                succeq: "⪰",
                succnapprox: "⪺",
                succneqq: "⪶",
                succnsim: "⋩",
                succsim: "≿",
                SuchThat: "∋",
                Sum: "∑",
                sum: "∑",
                sung: "♪",
                Sup: "⋑",
                sup: "⊃",
                sup1: "¹",
                sup2: "²",
                sup3: "³",
                supdot: "⪾",
                supdsub: "⫘",
                supE: "⫆",
                supe: "⊇",
                supedot: "⫄",
                Superset: "⊃",
                SupersetEqual: "⊇",
                suphsol: "⟉",
                suphsub: "⫗",
                suplarr: "⥻",
                supmult: "⫂",
                supnE: "⫌",
                supne: "⊋",
                supplus: "⫀",
                Supset: "⋑",
                supset: "⊃",
                supseteq: "⊇",
                supseteqq: "⫆",
                supsetneq: "⊋",
                supsetneqq: "⫌",
                supsim: "⫈",
                supsub: "⫔",
                supsup: "⫖",
                swarhk: "⤦",
                swArr: "⇙",
                swarr: "↙",
                swarrow: "↙",
                swnwar: "⤪",
                szlig: "ß",
                Tab: "\t",
                target: "⌖",
                Tau: "Τ",
                tau: "τ",
                tbrk: "⎴",
                Tcaron: "Ť",
                tcaron: "ť",
                Tcedil: "Ţ",
                tcedil: "ţ",
                Tcy: "Т",
                tcy: "т",
                tdot: "⃛",
                telrec: "⌕",
                Tfr: "𝔗",
                tfr: "𝔱",
                there4: "∴",
                Therefore: "∴",
                therefore: "∴",
                Theta: "Θ",
                theta: "θ",
                thetasym: "ϑ",
                thetav: "ϑ",
                thickapprox: "≈",
                thicksim: "∼",
                ThickSpace: "  ",
                thinsp: " ",
                ThinSpace: " ",
                thkap: "≈",
                thksim: "∼",
                THORN: "Þ",
                thorn: "þ",
                Tilde: "∼",
                tilde: "˜",
                TildeEqual: "≃",
                TildeFullEqual: "≅",
                TildeTilde: "≈",
                times: "×",
                timesb: "⊠",
                timesbar: "⨱",
                timesd: "⨰",
                tint: "∭",
                toea: "⤨",
                top: "⊤",
                topbot: "⌶",
                topcir: "⫱",
                Topf: "𝕋",
                topf: "𝕥",
                topfork: "⫚",
                tosa: "⤩",
                tprime: "‴",
                TRADE: "™",
                trade: "™",
                triangle: "▵",
                triangledown: "▿",
                triangleleft: "◃",
                trianglelefteq: "⊴",
                triangleq: "≜",
                triangleright: "▹",
                trianglerighteq: "⊵",
                tridot: "◬",
                trie: "≜",
                triminus: "⨺",
                TripleDot: "⃛",
                triplus: "⨹",
                trisb: "⧍",
                tritime: "⨻",
                trpezium: "⏢",
                Tscr: "𝒯",
                tscr: "𝓉",
                TScy: "Ц",
                tscy: "ц",
                TSHcy: "Ћ",
                tshcy: "ћ",
                Tstrok: "Ŧ",
                tstrok: "ŧ",
                twixt: "≬",
                twoheadleftarrow: "↞",
                twoheadrightarrow: "↠",
                Uacute: "Ú",
                uacute: "ú",
                Uarr: "↟",
                uArr: "⇑",
                uarr: "↑",
                Uarrocir: "⥉",
                Ubrcy: "Ў",
                ubrcy: "ў",
                Ubreve: "Ŭ",
                ubreve: "ŭ",
                Ucirc: "Û",
                ucirc: "û",
                Ucy: "У",
                ucy: "у",
                udarr: "⇅",
                Udblac: "Ű",
                udblac: "ű",
                udhar: "⥮",
                ufisht: "⥾",
                Ufr: "𝔘",
                ufr: "𝔲",
                Ugrave: "Ù",
                ugrave: "ù",
                uHar: "⥣",
                uharl: "↿",
                uharr: "↾",
                uhblk: "▀",
                ulcorn: "⌜",
                ulcorner: "⌜",
                ulcrop: "⌏",
                ultri: "◸",
                Umacr: "Ū",
                umacr: "ū",
                uml: "¨",
                UnderBar: "_",
                UnderBrace: "⏟",
                UnderBracket: "⎵",
                UnderParenthesis: "⏝",
                Union: "⋃",
                UnionPlus: "⊎",
                Uogon: "Ų",
                uogon: "ų",
                Uopf: "𝕌",
                uopf: "𝕦",
                UpArrow: "↑",
                Uparrow: "⇑",
                uparrow: "↑",
                UpArrowBar: "⤒",
                UpArrowDownArrow: "⇅",
                UpDownArrow: "↕",
                Updownarrow: "⇕",
                updownarrow: "↕",
                UpEquilibrium: "⥮",
                upharpoonleft: "↿",
                upharpoonright: "↾",
                uplus: "⊎",
                UpperLeftArrow: "↖",
                UpperRightArrow: "↗",
                Upsi: "ϒ",
                upsi: "υ",
                upsih: "ϒ",
                Upsilon: "Υ",
                upsilon: "υ",
                UpTee: "⊥",
                UpTeeArrow: "↥",
                upuparrows: "⇈",
                urcorn: "⌝",
                urcorner: "⌝",
                urcrop: "⌎",
                Uring: "Ů",
                uring: "ů",
                urtri: "◹",
                Uscr: "𝒰",
                uscr: "𝓊",
                utdot: "⋰",
                Utilde: "Ũ",
                utilde: "ũ",
                utri: "▵",
                utrif: "▴",
                uuarr: "⇈",
                Uuml: "Ü",
                uuml: "ü",
                uwangle: "⦧",
                vangrt: "⦜",
                varepsilon: "ϵ",
                varkappa: "ϰ",
                varnothing: "∅",
                varphi: "ϕ",
                varpi: "ϖ",
                varpropto: "∝",
                vArr: "⇕",
                varr: "↕",
                varrho: "ϱ",
                varsigma: "ς",
                varsubsetneq: "⊊︀",
                varsubsetneqq: "⫋︀",
                varsupsetneq: "⊋︀",
                varsupsetneqq: "⫌︀",
                vartheta: "ϑ",
                vartriangleleft: "⊲",
                vartriangleright: "⊳",
                Vbar: "⫫",
                vBar: "⫨",
                vBarv: "⫩",
                Vcy: "В",
                vcy: "в",
                VDash: "⊫",
                Vdash: "⊩",
                vDash: "⊨",
                vdash: "⊢",
                Vdashl: "⫦",
                Vee: "⋁",
                vee: "∨",
                veebar: "⊻",
                veeeq: "≚",
                vellip: "⋮",
                Verbar: "‖",
                verbar: "|",
                Vert: "‖",
                vert: "|",
                VerticalBar: "∣",
                VerticalLine: "|",
                VerticalSeparator: "❘",
                VerticalTilde: "≀",
                VeryThinSpace: " ",
                Vfr: "𝔙",
                vfr: "𝔳",
                vltri: "⊲",
                vnsub: "⊂⃒",
                vnsup: "⊃⃒",
                Vopf: "𝕍",
                vopf: "𝕧",
                vprop: "∝",
                vrtri: "⊳",
                Vscr: "𝒱",
                vscr: "𝓋",
                vsubnE: "⫋︀",
                vsubne: "⊊︀",
                vsupnE: "⫌︀",
                vsupne: "⊋︀",
                Vvdash: "⊪",
                vzigzag: "⦚",
                Wcirc: "Ŵ",
                wcirc: "ŵ",
                wedbar: "⩟",
                Wedge: "⋀",
                wedge: "∧",
                wedgeq: "≙",
                weierp: "℘",
                Wfr: "𝔚",
                wfr: "𝔴",
                Wopf: "𝕎",
                wopf: "𝕨",
                wp: "℘",
                wr: "≀",
                wreath: "≀",
                Wscr: "𝒲",
                wscr: "𝓌",
                xcap: "⋂",
                xcirc: "◯",
                xcup: "⋃",
                xdtri: "▽",
                Xfr: "𝔛",
                xfr: "𝔵",
                xhArr: "⟺",
                xharr: "⟷",
                Xi: "Ξ",
                xi: "ξ",
                xlArr: "⟸",
                xlarr: "⟵",
                xmap: "⟼",
                xnis: "⋻",
                xodot: "⨀",
                Xopf: "𝕏",
                xopf: "𝕩",
                xoplus: "⨁",
                xotime: "⨂",
                xrArr: "⟹",
                xrarr: "⟶",
                Xscr: "𝒳",
                xscr: "𝓍",
                xsqcup: "⨆",
                xuplus: "⨄",
                xutri: "△",
                xvee: "⋁",
                xwedge: "⋀",
                Yacute: "Ý",
                yacute: "ý",
                YAcy: "Я",
                yacy: "я",
                Ycirc: "Ŷ",
                ycirc: "ŷ",
                Ycy: "Ы",
                ycy: "ы",
                yen: "¥",
                Yfr: "𝔜",
                yfr: "𝔶",
                YIcy: "Ї",
                yicy: "ї",
                Yopf: "𝕐",
                yopf: "𝕪",
                Yscr: "𝒴",
                yscr: "𝓎",
                YUcy: "Ю",
                yucy: "ю",
                Yuml: "Ÿ",
                yuml: "ÿ",
                Zacute: "Ź",
                zacute: "ź",
                Zcaron: "Ž",
                zcaron: "ž",
                Zcy: "З",
                zcy: "з",
                Zdot: "Ż",
                zdot: "ż",
                zeetrf: "ℨ",
                ZeroWidthSpace: "​",
                Zeta: "Ζ",
                zeta: "ζ",
                Zfr: "ℨ",
                zfr: "𝔷",
                ZHcy: "Ж",
                zhcy: "ж",
                zigrarr: "⇝",
                Zopf: "ℤ",
                zopf: "𝕫",
                Zscr: "𝒵",
                zscr: "𝓏",
                zwj: "‍",
                zwnj: "‌"
            }
        },
        8315(e) {
            "use strict";
            var t = {};
            ["article", "aside", "button", "blockquote", "body", "canvas", "caption", "col", "colgroup", "dd", "div", "dl", "dt", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "iframe", "li", "map", "object", "ol", "output", "p", "pre", "progress", "script", "section", "style", "table", "tbody", "td", "textarea", "tfoot", "th", "tr", "thead", "ul", "video"].forEach(function(e) {
                t[e] = !0
            }),
            e.exports = t
        },
        8364(e) {
            "use strict";
            function t(e, t) {
                return e = e.source,
                t = t || "",
                function r(n, s) {
                    return n ? (s = s.source || s,
                    e = e.replace(n, s),
                    r) : new RegExp(e,t)
                }
            }
            var r = t(/(?:unquoted|single_quoted|double_quoted)/)("unquoted", /[^"'=<>`\x00-\x20]+/)("single_quoted", /'[^']*'/)("double_quoted", /"[^"]*"/)()
              , n = t(/(?:\s+attr_name(?:\s*=\s*attr_value)?)/)("attr_name", /[a-zA-Z_:][a-zA-Z0-9:._-]*/)("attr_value", r)()
              , s = t(/<[A-Za-z][A-Za-z0-9]*attribute*\s*\/?>/)("attribute", n)()
              , i = t(/^(?:open_tag|close_tag|comment|processing|declaration|cdata)/)("open_tag", s)("close_tag", /<\/[A-Za-z][A-Za-z0-9]*\s*>/)("comment", /<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->/)("processing", /<[?].*?[?]>/)("declaration", /<![A-Z]+\s+[^>]*>/)("cdata", /<!\[CDATA\[[\s\S]*?\]\]>/)();
            e.exports.l = i
        },
        4441(e) {
            "use strict";
            e.exports = ["coap", "doi", "javascript", "aaa", "aaas", "about", "acap", "cap", "cid", "crid", "data", "dav", "dict", "dns", "file", "ftp", "geo", "go", "gopher", "h323", "http", "https", "iax", "icap", "im", "imap", "info", "ipp", "iris", "iris.beep", "iris.xpc", "iris.xpcs", "iris.lwz", "ldap", "mailto", "mid", "msrp", "msrps", "mtqp", "mupdate", "news", "nfs", "ni", "nih", "nntp", "opaquelocktoken", "pop", "pres", "rtsp", "service", "session", "shttp", "sieve", "sip", "sips", "sms", "snmp", "soap.beep", "soap.beeps", "tag", "tel", "telnet", "tftp", "thismessage", "tn3270", "tip", "tv", "urn", "vemmi", "ws", "wss", "xcon", "xcon-userid", "xmlrpc.beep", "xmlrpc.beeps", "xmpp", "z39.50r", "z39.50s", "adiumxtra", "afp", "afs", "aim", "apt", "attachment", "aw", "beshare", "bitcoin", "bolo", "callto", "chrome", "chrome-extension", "com-eventbrite-attendee", "content", "cvs", "dlna-playsingle", "dlna-playcontainer", "dtn", "dvb", "ed2k", "facetime", "feed", "finger", "fish", "gg", "git", "gizmoproject", "gtalk", "hcp", "icon", "ipn", "irc", "irc6", "ircs", "itms", "jar", "jms", "keyparc", "lastfm", "ldaps", "magnet", "maps", "market", "message", "mms", "ms-help", "msnim", "mumble", "mvn", "notes", "oid", "palm", "paparazzi", "platform", "proxy", "psyc", "query", "res", "resource", "rmi", "rsync", "rtmp", "secondlife", "sftp", "sgn", "skype", "smb", "soldat", "spotify", "ssh", "steam", "svn", "teamspeak", "things", "udp", "unreal", "ut2004", "ventrilo", "view-source", "webcal", "wtai", "wyciwyg", "xfire", "xri", "ymsgr"]
        },
        6562(e, t, r) {
            "use strict";
            var n = Object.prototype.hasOwnProperty;
            function s(e, t) {
                return !!e && n.call(e, t)
            }
            var i = /\\([\\!"#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g;
            function o(e) {
                return !(e >= 55296 && e <= 57343 || e >= 64976 && e <= 65007 || !(65535 & ~e && 65534 != (65535 & e)) || e >= 0 && e <= 8 || 11 === e || e >= 14 && e <= 31 || e >= 127 && e <= 159 || e > 1114111)
            }
            function a(e) {
                if (e > 65535) {
                    var t = 55296 + ((e -= 65536) >> 10)
                      , r = 56320 + (1023 & e);
                    return String.fromCharCode(t, r)
                }
                return String.fromCharCode(e)
            }
            var l = /&([a-z#][a-z0-9]{1,31});/gi
              , c = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))/i
              , u = r(3332);
            function h(e, t) {
                var r = 0;
                return s(u, t) ? u[t] : 35 === t.charCodeAt(0) && c.test(t) && o(r = "x" === t[1].toLowerCase() ? parseInt(t.slice(2), 16) : parseInt(t.slice(1), 10)) ? a(r) : e
            }
            var p = /[&<>"]/
              , f = /[&<>"]/g
              , d = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;"
            };
            function g(e) {
                return d[e]
            }
            t.assign = function(e) {
                return [].slice.call(arguments, 1).forEach(function(t) {
                    if (t) {
                        if ("object" != typeof t)
                            throw new TypeError(t + "must be object");
                        Object.keys(t).forEach(function(r) {
                            e[r] = t[r]
                        })
                    }
                }),
                e
            }
            ,
            t.isString = function(e) {
                return "[object String]" === function(e) {
                    return Object.prototype.toString.call(e)
                }(e)
            }
            ,
            t.has = s,
            t.unescapeMd = function(e) {
                return e.indexOf("\\") < 0 ? e : e.replace(i, "$1")
            }
            ,
            t.isValidEntityCode = o,
            t.fromCodePoint = a,
            t.replaceEntities = function(e) {
                return e.indexOf("&") < 0 ? e : e.replace(l, h)
            }
            ,
            t.escapeHtml = function(e) {
                return p.test(e) ? e.replace(f, g) : e
            }
        },
        6565(e) {
            "use strict";
            e.exports = {
                options: {
                    html: !0,
                    xhtmlOut: !0,
                    breaks: !1,
                    langPrefix: "language-",
                    linkify: !1,
                    linkTarget: "",
                    typographer: !1,
                    quotes: "“”‘’",
                    highlight: null,
                    maxNesting: 20
                },
                components: {
                    core: {
                        rules: ["block", "inline", "references", "abbr2"]
                    },
                    block: {
                        rules: ["blockquote", "code", "fences", "heading", "hr", "htmlblock", "lheading", "list", "paragraph"]
                    },
                    inline: {
                        rules: ["autolink", "backticks", "emphasis", "entity", "escape", "htmltag", "links", "newline", "text"]
                    }
                }
            }
        },
        5976(e) {
            "use strict";
            e.exports = {
                options: {
                    html: !1,
                    xhtmlOut: !1,
                    breaks: !1,
                    langPrefix: "language-",
                    linkify: !1,
                    linkTarget: "",
                    typographer: !1,
                    quotes: "“”‘’",
                    highlight: null,
                    maxNesting: 20
                },
                components: {
                    core: {
                        rules: ["block", "inline", "references", "replacements", "linkify", "smartquotes", "references", "abbr2", "footnote_tail"]
                    },
                    block: {
                        rules: ["blockquote", "code", "fences", "footnote", "heading", "hr", "htmlblock", "lheading", "list", "paragraph", "table"]
                    },
                    inline: {
                        rules: ["autolink", "backticks", "del", "emphasis", "entity", "escape", "footnote_ref", "htmltag", "links", "newline", "text"]
                    }
                }
            }
        },
        8412(e) {
            "use strict";
            e.exports = {
                options: {
                    html: !1,
                    xhtmlOut: !1,
                    breaks: !1,
                    langPrefix: "language-",
                    linkify: !1,
                    linkTarget: "",
                    typographer: !1,
                    quotes: "“”‘’",
                    highlight: null,
                    maxNesting: 20
                },
                components: {
                    core: {},
                    block: {},
                    inline: {}
                }
            }
        },
        3099(e, t, r) {
            "use strict";
            var n = r(6562).replaceEntities;
            e.exports = function(e) {
                var t = n(e);
                try {
                    t = decodeURI(t)
                } catch (e) {}
                return encodeURI(t)
            }
        },
        9226(e) {
            "use strict";
            e.exports = function(e) {
                return e.trim().replace(/\s+/g, " ").toUpperCase()
            }
        },
        4636(e, t, r) {
            "use strict";
            var n = r(3099)
              , s = r(6562).unescapeMd;
            e.exports = function(e, t) {
                var r, i, o, a = t, l = e.posMax;
                if (60 === e.src.charCodeAt(t)) {
                    for (t++; t < l; ) {
                        if (10 === (r = e.src.charCodeAt(t)))
                            return !1;
                        if (62 === r)
                            return o = n(s(e.src.slice(a + 1, t))),
                            !!e.parser.validateLink(o) && (e.pos = t + 1,
                            e.linkContent = o,
                            !0);
                        92 === r && t + 1 < l ? t += 2 : t++
                    }
                    return !1
                }
                for (i = 0; t < l && 32 !== (r = e.src.charCodeAt(t)) && !(r < 32 || 127 === r); )
                    if (92 === r && t + 1 < l)
                        t += 2;
                    else {
                        if (40 === r && ++i > 1)
                            break;
                        if (41 === r && --i < 0)
                            break;
                        t++
                    }
                return a !== t && (o = s(e.src.slice(a, t)),
                !!e.parser.validateLink(o) && (e.linkContent = o,
                e.pos = t,
                !0))
            }
        },
        2462(e) {
            "use strict";
            e.exports = function(e, t) {
                var r, n, s, i = -1, o = e.posMax, a = e.pos, l = e.isInLabel;
                if (e.isInLabel)
                    return -1;
                if (e.labelUnmatchedScopes)
                    return e.labelUnmatchedScopes--,
                    -1;
                for (e.pos = t + 1,
                e.isInLabel = !0,
                r = 1; e.pos < o; ) {
                    if (91 === (s = e.src.charCodeAt(e.pos)))
                        r++;
                    else if (93 === s && 0 === --r) {
                        n = !0;
                        break
                    }
                    e.parser.skipToken(e)
                }
                return n ? (i = e.pos,
                e.labelUnmatchedScopes = 0) : e.labelUnmatchedScopes = r - 1,
                e.pos = a,
                e.isInLabel = l,
                i
            }
        },
        2282(e, t, r) {
            "use strict";
            var n = r(6562).unescapeMd;
            e.exports = function(e, t) {
                var r, s = t, i = e.posMax, o = e.src.charCodeAt(t);
                if (34 !== o && 39 !== o && 40 !== o)
                    return !1;
                for (t++,
                40 === o && (o = 41); t < i; ) {
                    if ((r = e.src.charCodeAt(t)) === o)
                        return e.pos = t + 1,
                        e.linkContent = n(e.src.slice(s + 1, t)),
                        !0;
                    92 === r && t + 1 < i ? t += 2 : t++
                }
                return !1
            }
        },
        5033(e, t, r) {
            "use strict";
            var n = r(6562).assign
              , s = r(7418)
              , i = r(618)
              , o = r(7304)
              , a = r(2224)
              , l = r(6381)
              , c = {
                default: r(5976),
                full: r(8412),
                commonmark: r(6565)
            };
            function u(e, t, r) {
                this.src = t,
                this.env = r,
                this.options = e.options,
                this.tokens = [],
                this.inlineMode = !1,
                this.inline = e.inline,
                this.block = e.block,
                this.renderer = e.renderer,
                this.typographer = e.typographer
            }
            function h(e, t) {
                "string" != typeof e && (t = e,
                e = "default"),
                this.inline = new a,
                this.block = new o,
                this.core = new i,
                this.renderer = new s,
                this.ruler = new l,
                this.options = {},
                this.configure(c[e]),
                this.set(t || {})
            }
            h.prototype.set = function(e) {
                n(this.options, e)
            }
            ,
            h.prototype.configure = function(e) {
                var t = this;
                if (!e)
                    throw new Error("Wrong `remarkable` preset, check name/content");
                e.options && t.set(e.options),
                e.components && Object.keys(e.components).forEach(function(r) {
                    e.components[r].rules && t[r].ruler.enable(e.components[r].rules, !0)
                })
            }
            ,
            h.prototype.use = function(e, t) {
                return e(this, t),
                this
            }
            ,
            h.prototype.parse = function(e, t) {
                var r = new u(this,e,t);
                return this.core.process(r),
                r.tokens
            }
            ,
            h.prototype.render = function(e, t) {
                return t = t || {},
                this.renderer.render(this.parse(e, t), this.options, t)
            }
            ,
            h.prototype.parseInline = function(e, t) {
                var r = new u(this,e,t);
                return r.inlineMode = !0,
                this.core.process(r),
                r.tokens
            }
            ,
            h.prototype.renderInline = function(e, t) {
                return t = t || {},
                this.renderer.render(this.parseInline(e, t), this.options, t)
            }
            ,
            e.exports = h,
            e.exports.utils = r(6562)
        },
        7304(e, t, r) {
            "use strict";
            var n = r(6381)
              , s = r(5364)
              , i = [["code", r(5930)], ["fences", r(3501), ["paragraph", "blockquote", "list"]], ["blockquote", r(8948), ["paragraph", "blockquote", "list"]], ["hr", r(1981), ["paragraph", "blockquote", "list"]], ["list", r(5067), ["paragraph", "blockquote"]], ["footnote", r(6611), ["paragraph"]], ["heading", r(8413), ["paragraph", "blockquote"]], ["lheading", r(8929)], ["htmlblock", r(7689), ["paragraph", "blockquote"]], ["table", r(6735), ["paragraph"]], ["deflist", r(256), ["paragraph"]], ["paragraph", r(765)]];
            function o() {
                this.ruler = new n;
                for (var e = 0; e < i.length; e++)
                    this.ruler.push(i[e][0], i[e][1], {
                        alt: (i[e][2] || []).slice()
                    })
            }
            o.prototype.tokenize = function(e, t, r) {
                for (var n, s = this.ruler.getRules(""), i = s.length, o = t, a = !1; o < r && (e.line = o = e.skipEmptyLines(o),
                !(o >= r)) && !(e.tShift[o] < e.blkIndent); ) {
                    for (n = 0; n < i && !s[n](e, o, r, !1); n++)
                        ;
                    if (e.tight = !a,
                    e.isEmpty(e.line - 1) && (a = !0),
                    (o = e.line) < r && e.isEmpty(o)) {
                        if (a = !0,
                        ++o < r && "list" === e.parentType && e.isEmpty(o))
                            break;
                        e.line = o
                    }
                }
            }
            ;
            var a = /[\n\t]/g
              , l = /\r[\n\u0085]|[\u2424\u2028\u0085]/g
              , c = /\u00a0/g;
            o.prototype.parse = function(e, t, r, n) {
                var i, o = 0, u = 0;
                if (!e)
                    return [];
                (e = (e = e.replace(c, " ")).replace(l, "\n")).indexOf("\t") >= 0 && (e = e.replace(a, function(t, r) {
                    var n;
                    return 10 === e.charCodeAt(r) ? (o = r + 1,
                    u = 0,
                    t) : (n = "    ".slice((r - o - u) % 4),
                    u = r - o + 1,
                    n)
                })),
                i = new s(e,this,t,r,n),
                this.tokenize(i, i.line, i.lineMax)
            }
            ,
            e.exports = o
        },
        618(e, t, r) {
            "use strict";
            var n = r(6381)
              , s = [["block", r(5420)], ["abbr", r(5210)], ["references", r(995)], ["inline", r(3068)], ["footnote_tail", r(9426)], ["abbr2", r(3402)], ["replacements", r(8812)], ["smartquotes", r(2713)], ["linkify", r(1731)]];
            function i() {
                this.options = {},
                this.ruler = new n;
                for (var e = 0; e < s.length; e++)
                    this.ruler.push(s[e][0], s[e][1])
            }
            i.prototype.process = function(e) {
                var t, r, n;
                for (t = 0,
                r = (n = this.ruler.getRules("")).length; t < r; t++)
                    n[t](e)
            }
            ,
            e.exports = i
        },
        2224(e, t, r) {
            "use strict";
            var n = r(6381)
              , s = r(8892)
              , i = r(6562)
              , o = [["text", r(7344)], ["newline", r(9319)], ["escape", r(5780)], ["backticks", r(3108)], ["del", r(3506)], ["ins", r(7527)], ["mark", r(8758)], ["emphasis", r(1285)], ["sub", r(2049)], ["sup", r(3071)], ["links", r(9630)], ["footnote_inline", r(479)], ["footnote_ref", r(1977)], ["autolink", r(6764)], ["htmltag", r(4916)], ["entity", r(188)]];
            function a() {
                this.ruler = new n;
                for (var e = 0; e < o.length; e++)
                    this.ruler.push(o[e][0], o[e][1]);
                this.validateLink = l
            }
            function l(e) {
                var t = e.trim().toLowerCase();
                return -1 === (t = i.replaceEntities(t)).indexOf(":") || -1 === ["vbscript", "javascript", "file", "data"].indexOf(t.split(":")[0])
            }
            a.prototype.skipToken = function(e) {
                var t, r, n = this.ruler.getRules(""), s = n.length, i = e.pos;
                if ((r = e.cacheGet(i)) > 0)
                    e.pos = r;
                else {
                    for (t = 0; t < s; t++)
                        if (n[t](e, !0))
                            return void e.cacheSet(i, e.pos);
                    e.pos++,
                    e.cacheSet(i, e.pos)
                }
            }
            ,
            a.prototype.tokenize = function(e) {
                for (var t, r, n = this.ruler.getRules(""), s = n.length, i = e.posMax; e.pos < i; ) {
                    for (r = 0; r < s && !(t = n[r](e, !1)); r++)
                        ;
                    if (t) {
                        if (e.pos >= i)
                            break
                    } else
                        e.pending += e.src[e.pos++]
                }
                e.pending && e.pushPending()
            }
            ,
            a.prototype.parse = function(e, t, r, n) {
                var i = new s(e,this,t,r,n);
                this.tokenize(i)
            }
            ,
            e.exports = a
        },
        7418(e, t, r) {
            "use strict";
            var n = r(6562)
              , s = r(6206);
            function i() {
                this.rules = n.assign({}, s),
                this.getBreak = s.getBreak
            }
            e.exports = i,
            i.prototype.renderInline = function(e, t, r) {
                for (var n = this.rules, s = e.length, i = 0, o = ""; s--; )
                    o += n[e[i].type](e, i++, t, r, this);
                return o
            }
            ,
            i.prototype.render = function(e, t, r) {
                for (var n = this.rules, s = e.length, i = -1, o = ""; ++i < s; )
                    "inline" === e[i].type ? o += this.renderInline(e[i].children, t, r) : o += n[e[i].type](e, i, t, r, this);
                return o
            }
        },
        6381(e) {
            "use strict";
            function t() {
                this.__rules__ = [],
                this.__cache__ = null
            }
            t.prototype.__find__ = function(e) {
                for (var t = this.__rules__.length, r = -1; t--; )
                    if (this.__rules__[++r].name === e)
                        return r;
                return -1
            }
            ,
            t.prototype.__compile__ = function() {
                var e = this
                  , t = [""];
                e.__rules__.forEach(function(e) {
                    e.enabled && e.alt.forEach(function(e) {
                        t.indexOf(e) < 0 && t.push(e)
                    })
                }),
                e.__cache__ = {},
                t.forEach(function(t) {
                    e.__cache__[t] = [],
                    e.__rules__.forEach(function(r) {
                        r.enabled && (t && r.alt.indexOf(t) < 0 || e.__cache__[t].push(r.fn))
                    })
                })
            }
            ,
            t.prototype.at = function(e, t, r) {
                var n = this.__find__(e)
                  , s = r || {};
                if (-1 === n)
                    throw new Error("Parser rule not found: " + e);
                this.__rules__[n].fn = t,
                this.__rules__[n].alt = s.alt || [],
                this.__cache__ = null
            }
            ,
            t.prototype.before = function(e, t, r, n) {
                var s = this.__find__(e)
                  , i = n || {};
                if (-1 === s)
                    throw new Error("Parser rule not found: " + e);
                this.__rules__.splice(s, 0, {
                    name: t,
                    enabled: !0,
                    fn: r,
                    alt: i.alt || []
                }),
                this.__cache__ = null
            }
            ,
            t.prototype.after = function(e, t, r, n) {
                var s = this.__find__(e)
                  , i = n || {};
                if (-1 === s)
                    throw new Error("Parser rule not found: " + e);
                this.__rules__.splice(s + 1, 0, {
                    name: t,
                    enabled: !0,
                    fn: r,
                    alt: i.alt || []
                }),
                this.__cache__ = null
            }
            ,
            t.prototype.push = function(e, t, r) {
                var n = r || {};
                this.__rules__.push({
                    name: e,
                    enabled: !0,
                    fn: t,
                    alt: n.alt || []
                }),
                this.__cache__ = null
            }
            ,
            t.prototype.enable = function(e, t) {
                e = Array.isArray(e) ? e : [e],
                t && this.__rules__.forEach(function(e) {
                    e.enabled = !1
                }),
                e.forEach(function(e) {
                    var t = this.__find__(e);
                    if (t < 0)
                        throw new Error("Rules manager: invalid rule name " + e);
                    this.__rules__[t].enabled = !0
                }, this),
                this.__cache__ = null
            }
            ,
            t.prototype.disable = function(e) {
                (e = Array.isArray(e) ? e : [e]).forEach(function(e) {
                    var t = this.__find__(e);
                    if (t < 0)
                        throw new Error("Rules manager: invalid rule name " + e);
                    this.__rules__[t].enabled = !1
                }, this),
                this.__cache__ = null
            }
            ,
            t.prototype.getRules = function(e) {
                return null === this.__cache__ && this.__compile__(),
                this.__cache__[e] || []
            }
            ,
            e.exports = t
        },
        6206(e, t, r) {
            "use strict";
            var n = r(6562).has
              , s = r(6562).unescapeMd
              , i = r(6562).replaceEntities
              , o = r(6562).escapeHtml
              , a = {};
            function l(e, t) {
                return ++t >= e.length - 2 ? t : "paragraph_open" === e[t].type && e[t].tight && "inline" === e[t + 1].type && 0 === e[t + 1].content.length && "paragraph_close" === e[t + 2].type && e[t + 2].tight ? l(e, t + 2) : t
            }
            a.blockquote_open = function() {
                return "<blockquote>\n"
            }
            ,
            a.blockquote_close = function(e, t) {
                return "</blockquote>" + c(e, t)
            }
            ,
            a.code = function(e, t) {
                return e[t].block ? "<pre><code>" + o(e[t].content) + "</code></pre>" + c(e, t) : "<code>" + o(e[t].content) + "</code>"
            }
            ,
            a.fence = function(e, t, r, a, l) {
                var u, h, p = e[t], f = "", d = r.langPrefix;
                if (p.params) {
                    if (h = (u = p.params.split(/\s+/g)).join(" "),
                    n(l.rules.fence_custom, u[0]))
                        return l.rules.fence_custom[u[0]](e, t, r, a, l);
                    f = ' class="' + d + o(i(s(h))) + '"'
                }
                return "<pre><code" + f + ">" + (r.highlight && r.highlight.apply(r.highlight, [p.content].concat(u)) || o(p.content)) + "</code></pre>" + c(e, t)
            }
            ,
            a.fence_custom = {},
            a.heading_open = function(e, t) {
                return "<h" + e[t].hLevel + ">"
            }
            ,
            a.heading_close = function(e, t) {
                return "</h" + e[t].hLevel + ">\n"
            }
            ,
            a.hr = function(e, t, r) {
                return (r.xhtmlOut ? "<hr />" : "<hr>") + c(e, t)
            }
            ,
            a.bullet_list_open = function() {
                return "<ul>\n"
            }
            ,
            a.bullet_list_close = function(e, t) {
                return "</ul>" + c(e, t)
            }
            ,
            a.list_item_open = function() {
                return "<li>"
            }
            ,
            a.list_item_close = function() {
                return "</li>\n"
            }
            ,
            a.ordered_list_open = function(e, t) {
                var r = e[t];
                return "<ol" + (r.order > 1 ? ' start="' + r.order + '"' : "") + ">\n"
            }
            ,
            a.ordered_list_close = function(e, t) {
                return "</ol>" + c(e, t)
            }
            ,
            a.paragraph_open = function(e, t) {
                return e[t].tight ? "" : "<p>"
            }
            ,
            a.paragraph_close = function(e, t) {
                var r = !(e[t].tight && t && "inline" === e[t - 1].type && !e[t - 1].content);
                return (e[t].tight ? "" : "</p>") + (r ? c(e, t) : "")
            }
            ,
            a.link_open = function(e, t, r) {
                var n = e[t].title ? ' title="' + o(i(e[t].title)) + '"' : ""
                  , s = r.linkTarget ? ' target="' + r.linkTarget + '"' : "";
                return '<a href="' + o(e[t].href) + '"' + n + s + ">"
            }
            ,
            a.link_close = function() {
                return "</a>"
            }
            ,
            a.image = function(e, t, r) {
                var n = ' src="' + o(e[t].src) + '"'
                  , a = e[t].title ? ' title="' + o(i(e[t].title)) + '"' : "";
                return "<img" + n + ' alt="' + (e[t].alt ? o(i(s(e[t].alt))) : "") + '"' + a + (r.xhtmlOut ? " /" : "") + ">"
            }
            ,
            a.table_open = function() {
                return "<table>\n"
            }
            ,
            a.table_close = function() {
                return "</table>\n"
            }
            ,
            a.thead_open = function() {
                return "<thead>\n"
            }
            ,
            a.thead_close = function() {
                return "</thead>\n"
            }
            ,
            a.tbody_open = function() {
                return "<tbody>\n"
            }
            ,
            a.tbody_close = function() {
                return "</tbody>\n"
            }
            ,
            a.tr_open = function() {
                return "<tr>"
            }
            ,
            a.tr_close = function() {
                return "</tr>\n"
            }
            ,
            a.th_open = function(e, t) {
                var r = e[t];
                return "<th" + (r.align ? ' style="text-align:' + r.align + '"' : "") + ">"
            }
            ,
            a.th_close = function() {
                return "</th>"
            }
            ,
            a.td_open = function(e, t) {
                var r = e[t];
                return "<td" + (r.align ? ' style="text-align:' + r.align + '"' : "") + ">"
            }
            ,
            a.td_close = function() {
                return "</td>"
            }
            ,
            a.strong_open = function() {
                return "<strong>"
            }
            ,
            a.strong_close = function() {
                return "</strong>"
            }
            ,
            a.em_open = function() {
                return "<em>"
            }
            ,
            a.em_close = function() {
                return "</em>"
            }
            ,
            a.del_open = function() {
                return "<del>"
            }
            ,
            a.del_close = function() {
                return "</del>"
            }
            ,
            a.ins_open = function() {
                return "<ins>"
            }
            ,
            a.ins_close = function() {
                return "</ins>"
            }
            ,
            a.mark_open = function() {
                return "<mark>"
            }
            ,
            a.mark_close = function() {
                return "</mark>"
            }
            ,
            a.sub = function(e, t) {
                return "<sub>" + o(e[t].content) + "</sub>"
            }
            ,
            a.sup = function(e, t) {
                return "<sup>" + o(e[t].content) + "</sup>"
            }
            ,
            a.hardbreak = function(e, t, r) {
                return r.xhtmlOut ? "<br />\n" : "<br>\n"
            }
            ,
            a.softbreak = function(e, t, r) {
                return r.breaks ? r.xhtmlOut ? "<br />\n" : "<br>\n" : "\n"
            }
            ,
            a.text = function(e, t) {
                return o(e[t].content)
            }
            ,
            a.htmlblock = function(e, t) {
                return e[t].content
            }
            ,
            a.htmltag = function(e, t) {
                return e[t].content
            }
            ,
            a.abbr_open = function(e, t) {
                return '<abbr title="' + o(i(e[t].title)) + '">'
            }
            ,
            a.abbr_close = function() {
                return "</abbr>"
            }
            ,
            a.footnote_ref = function(e, t) {
                var r = Number(e[t].id + 1).toString()
                  , n = "fnref" + r;
                return e[t].subId > 0 && (n += ":" + e[t].subId),
                '<sup class="footnote-ref"><a href="#fn' + r + '" id="' + n + '">[' + r + "]</a></sup>"
            }
            ,
            a.footnote_block_open = function(e, t, r) {
                return (r.xhtmlOut ? '<hr class="footnotes-sep" />\n' : '<hr class="footnotes-sep">\n') + '<section class="footnotes">\n<ol class="footnotes-list">\n'
            }
            ,
            a.footnote_block_close = function() {
                return "</ol>\n</section>\n"
            }
            ,
            a.footnote_open = function(e, t) {
                return '<li id="fn' + Number(e[t].id + 1).toString() + '"  class="footnote-item">'
            }
            ,
            a.footnote_close = function() {
                return "</li>\n"
            }
            ,
            a.footnote_anchor = function(e, t) {
                var r = "fnref" + Number(e[t].id + 1).toString();
                return e[t].subId > 0 && (r += ":" + e[t].subId),
                ' <a href="#' + r + '" class="footnote-backref">↩</a>'
            }
            ,
            a.dl_open = function() {
                return "<dl>\n"
            }
            ,
            a.dt_open = function() {
                return "<dt>"
            }
            ,
            a.dd_open = function() {
                return "<dd>"
            }
            ,
            a.dl_close = function() {
                return "</dl>\n"
            }
            ,
            a.dt_close = function() {
                return "</dt>\n"
            }
            ,
            a.dd_close = function() {
                return "</dd>\n"
            }
            ;
            var c = a.getBreak = function(e, t) {
                return (t = l(e, t)) < e.length && "list_item_close" === e[t].type ? "" : "\n"
            }
            ;
            e.exports = a
        },
        8948(e) {
            "use strict";
            e.exports = function(e, t, r, n) {
                var s, i, o, a, l, c, u, h, p, f, d, g = e.bMarks[t] + e.tShift[t], m = e.eMarks[t];
                if (g > m)
                    return !1;
                if (62 !== e.src.charCodeAt(g++))
                    return !1;
                if (e.level >= e.options.maxNesting)
                    return !1;
                if (n)
                    return !0;
                for (32 === e.src.charCodeAt(g) && g++,
                l = e.blkIndent,
                e.blkIndent = 0,
                a = [e.bMarks[t]],
                e.bMarks[t] = g,
                i = (g = g < m ? e.skipSpaces(g) : g) >= m,
                o = [e.tShift[t]],
                e.tShift[t] = g - e.bMarks[t],
                h = e.parser.ruler.getRules("blockquote"),
                s = t + 1; s < r && !((g = e.bMarks[s] + e.tShift[s]) >= (m = e.eMarks[s])); s++)
                    if (62 !== e.src.charCodeAt(g++)) {
                        if (i)
                            break;
                        for (d = !1,
                        p = 0,
                        f = h.length; p < f; p++)
                            if (h[p](e, s, r, !0)) {
                                d = !0;
                                break
                            }
                        if (d)
                            break;
                        a.push(e.bMarks[s]),
                        o.push(e.tShift[s]),
                        e.tShift[s] = -1337
                    } else
                        32 === e.src.charCodeAt(g) && g++,
                        a.push(e.bMarks[s]),
                        e.bMarks[s] = g,
                        i = (g = g < m ? e.skipSpaces(g) : g) >= m,
                        o.push(e.tShift[s]),
                        e.tShift[s] = g - e.bMarks[s];
                for (c = e.parentType,
                e.parentType = "blockquote",
                e.tokens.push({
                    type: "blockquote_open",
                    lines: u = [t, 0],
                    level: e.level++
                }),
                e.parser.tokenize(e, t, s),
                e.tokens.push({
                    type: "blockquote_close",
                    level: --e.level
                }),
                e.parentType = c,
                u[1] = e.line,
                p = 0; p < o.length; p++)
                    e.bMarks[p + t] = a[p],
                    e.tShift[p + t] = o[p];
                return e.blkIndent = l,
                !0
            }
        },
        5930(e) {
            "use strict";
            e.exports = function(e, t, r) {
                var n, s;
                if (e.tShift[t] - e.blkIndent < 4)
                    return !1;
                for (s = n = t + 1; n < r; )
                    if (e.isEmpty(n))
                        n++;
                    else {
                        if (!(e.tShift[n] - e.blkIndent >= 4))
                            break;
                        s = ++n
                    }
                return e.line = n,
                e.tokens.push({
                    type: "code",
                    content: e.getLines(t, s, 4 + e.blkIndent, !0),
                    block: !0,
                    lines: [t, e.line],
                    level: e.level
                }),
                !0
            }
        },
        256(e) {
            "use strict";
            function t(e, t) {
                var r, n, s = e.bMarks[t] + e.tShift[t], i = e.eMarks[t];
                return s >= i || 126 !== (n = e.src.charCodeAt(s++)) && 58 !== n || s === (r = e.skipSpaces(s)) || r >= i ? -1 : r
            }
            e.exports = function(e, r, n, s) {
                var i, o, a, l, c, u, h, p, f, d, g, m, b, v;
                if (s)
                    return !(e.ddIndent < 0) && t(e, r) >= 0;
                if (h = r + 1,
                e.isEmpty(h) && ++h > n)
                    return !1;
                if (e.tShift[h] < e.blkIndent)
                    return !1;
                if ((i = t(e, h)) < 0)
                    return !1;
                if (e.level >= e.options.maxNesting)
                    return !1;
                u = e.tokens.length,
                e.tokens.push({
                    type: "dl_open",
                    lines: c = [r, 0],
                    level: e.level++
                }),
                a = r,
                o = h;
                e: for (; ; ) {
                    for (v = !0,
                    b = !1,
                    e.tokens.push({
                        type: "dt_open",
                        lines: [a, a],
                        level: e.level++
                    }),
                    e.tokens.push({
                        type: "inline",
                        content: e.getLines(a, a + 1, e.blkIndent, !1).trim(),
                        level: e.level + 1,
                        lines: [a, a],
                        children: []
                    }),
                    e.tokens.push({
                        type: "dt_close",
                        level: --e.level
                    }); ; ) {
                        if (e.tokens.push({
                            type: "dd_open",
                            lines: l = [h, 0],
                            level: e.level++
                        }),
                        m = e.tight,
                        f = e.ddIndent,
                        p = e.blkIndent,
                        g = e.tShift[o],
                        d = e.parentType,
                        e.blkIndent = e.ddIndent = e.tShift[o] + 2,
                        e.tShift[o] = i - e.bMarks[o],
                        e.tight = !0,
                        e.parentType = "deflist",
                        e.parser.tokenize(e, o, n, !0),
                        e.tight && !b || (v = !1),
                        b = e.line - o > 1 && e.isEmpty(e.line - 1),
                        e.tShift[o] = g,
                        e.tight = m,
                        e.parentType = d,
                        e.blkIndent = p,
                        e.ddIndent = f,
                        e.tokens.push({
                            type: "dd_close",
                            level: --e.level
                        }),
                        l[1] = h = e.line,
                        h >= n)
                            break e;
                        if (e.tShift[h] < e.blkIndent)
                            break e;
                        if ((i = t(e, h)) < 0)
                            break;
                        o = h
                    }
                    if (h >= n)
                        break;
                    if (a = h,
                    e.isEmpty(a))
                        break;
                    if (e.tShift[a] < e.blkIndent)
                        break;
                    if ((o = a + 1) >= n)
                        break;
                    if (e.isEmpty(o) && o++,
                    o >= n)
                        break;
                    if (e.tShift[o] < e.blkIndent)
                        break;
                    if ((i = t(e, o)) < 0)
                        break
                }
                return e.tokens.push({
                    type: "dl_close",
                    level: --e.level
                }),
                c[1] = h,
                e.line = h,
                v && function(e, t) {
                    var r, n, s = e.level + 2;
                    for (r = t + 2,
                    n = e.tokens.length - 2; r < n; r++)
                        e.tokens[r].level === s && "paragraph_open" === e.tokens[r].type && (e.tokens[r + 2].tight = !0,
                        e.tokens[r].tight = !0,
                        r += 2)
                }(e, u),
                !0
            }
        },
        3501(e) {
            "use strict";
            e.exports = function(e, t, r, n) {
                var s, i, o, a, l, c = !1, u = e.bMarks[t] + e.tShift[t], h = e.eMarks[t];
                if (u + 3 > h)
                    return !1;
                if (126 !== (s = e.src.charCodeAt(u)) && 96 !== s)
                    return !1;
                if (l = u,
                (i = (u = e.skipChars(u, s)) - l) < 3)
                    return !1;
                if ((o = e.src.slice(u, h).trim()).indexOf("`") >= 0)
                    return !1;
                if (n)
                    return !0;
                for (a = t; !(++a >= r || (u = l = e.bMarks[a] + e.tShift[a]) < (h = e.eMarks[a]) && e.tShift[a] < e.blkIndent); )
                    if (e.src.charCodeAt(u) === s && !(e.tShift[a] - e.blkIndent >= 4 || (u = e.skipChars(u, s)) - l < i || (u = e.skipSpaces(u)) < h)) {
                        c = !0;
                        break
                    }
                return i = e.tShift[t],
                e.line = a + (c ? 1 : 0),
                e.tokens.push({
                    type: "fence",
                    params: o,
                    content: e.getLines(t + 1, a, i, !0),
                    lines: [t, e.line],
                    level: e.level
                }),
                !0
            }
        },
        6611(e) {
            "use strict";
            e.exports = function(e, t, r, n) {
                var s, i, o, a, l, c = e.bMarks[t] + e.tShift[t], u = e.eMarks[t];
                if (c + 4 > u)
                    return !1;
                if (91 !== e.src.charCodeAt(c))
                    return !1;
                if (94 !== e.src.charCodeAt(c + 1))
                    return !1;
                if (e.level >= e.options.maxNesting)
                    return !1;
                for (a = c + 2; a < u; a++) {
                    if (32 === e.src.charCodeAt(a))
                        return !1;
                    if (93 === e.src.charCodeAt(a))
                        break
                }
                return !(a === c + 2 || a + 1 >= u || 58 !== e.src.charCodeAt(++a) || (n || (a++,
                e.env.footnotes || (e.env.footnotes = {}),
                e.env.footnotes.refs || (e.env.footnotes.refs = {}),
                l = e.src.slice(c + 2, a - 2),
                e.env.footnotes.refs[":" + l] = -1,
                e.tokens.push({
                    type: "footnote_reference_open",
                    label: l,
                    level: e.level++
                }),
                s = e.bMarks[t],
                i = e.tShift[t],
                o = e.parentType,
                e.tShift[t] = e.skipSpaces(a) - a,
                e.bMarks[t] = a,
                e.blkIndent += 4,
                e.parentType = "footnote",
                e.tShift[t] < e.blkIndent && (e.tShift[t] += e.blkIndent,
                e.bMarks[t] -= e.blkIndent),
                e.parser.tokenize(e, t, r, !0),
                e.parentType = o,
                e.blkIndent -= 4,
                e.tShift[t] = i,
                e.bMarks[t] = s,
                e.tokens.push({
                    type: "footnote_reference_close",
                    level: --e.level
                })),
                0))
            }
        },
        8413(e) {
            "use strict";
            e.exports = function(e, t, r, n) {
                var s, i, o, a = e.bMarks[t] + e.tShift[t], l = e.eMarks[t];
                if (a >= l)
                    return !1;
                if (35 !== (s = e.src.charCodeAt(a)) || a >= l)
                    return !1;
                for (i = 1,
                s = e.src.charCodeAt(++a); 35 === s && a < l && i <= 6; )
                    i++,
                    s = e.src.charCodeAt(++a);
                return !(i > 6 || a < l && 32 !== s || (n || (l = e.skipCharsBack(l, 32, a),
                (o = e.skipCharsBack(l, 35, a)) > a && 32 === e.src.charCodeAt(o - 1) && (l = o),
                e.line = t + 1,
                e.tokens.push({
                    type: "heading_open",
                    hLevel: i,
                    lines: [t, e.line],
                    level: e.level
                }),
                a < l && e.tokens.push({
                    type: "inline",
                    content: e.src.slice(a, l).trim(),
                    level: e.level + 1,
                    lines: [t, e.line],
                    children: []
                }),
                e.tokens.push({
                    type: "heading_close",
                    hLevel: i,
                    level: e.level
                })),
                0))
            }
        },
        1981(e) {
            "use strict";
            e.exports = function(e, t, r, n) {
                var s, i, o, a = e.bMarks[t], l = e.eMarks[t];
                if ((a += e.tShift[t]) > l)
                    return !1;
                if (42 !== (s = e.src.charCodeAt(a++)) && 45 !== s && 95 !== s)
                    return !1;
                for (i = 1; a < l; ) {
                    if ((o = e.src.charCodeAt(a++)) !== s && 32 !== o)
                        return !1;
                    o === s && i++
                }
                return !(i < 3 || (n || (e.line = t + 1,
                e.tokens.push({
                    type: "hr",
                    lines: [t, e.line],
                    level: e.level
                })),
                0))
            }
        },
        7689(e, t, r) {
            "use strict";
            var n = r(8315)
              , s = /^<([a-zA-Z]{1,15})[\s\/>]/
              , i = /^<\/([a-zA-Z]{1,15})[\s>]/;
            e.exports = function(e, t, r, o) {
                var a, l, c, u = e.bMarks[t], h = e.eMarks[t], p = e.tShift[t];
                if (u += p,
                !e.options.html)
                    return !1;
                if (p > 3 || u + 2 >= h)
                    return !1;
                if (60 !== e.src.charCodeAt(u))
                    return !1;
                if (33 === (a = e.src.charCodeAt(u + 1)) || 63 === a) {
                    if (o)
                        return !0
                } else {
                    if (47 !== a && !function(e) {
                        var t = 32 | e;
                        return t >= 97 && t <= 122
                    }(a))
                        return !1;
                    if (47 === a) {
                        if (!(l = e.src.slice(u, h).match(i)))
                            return !1
                    } else if (!(l = e.src.slice(u, h).match(s)))
                        return !1;
                    if (!0 !== n[l[1].toLowerCase()])
                        return !1;
                    if (o)
                        return !0
                }
                for (c = t + 1; c < e.lineMax && !e.isEmpty(c); )
                    c++;
                return e.line = c,
                e.tokens.push({
                    type: "htmlblock",
                    level: e.level,
                    lines: [t, e.line],
                    content: e.getLines(t, c, 0, !0)
                }),
                !0
            }
        },
        8929(e) {
            "use strict";
            e.exports = function(e, t, r) {
                var n, s, i, o = t + 1;
                return !(o >= r || e.tShift[o] < e.blkIndent || e.tShift[o] - e.blkIndent > 3 || (s = e.bMarks[o] + e.tShift[o]) >= (i = e.eMarks[o]) || 45 !== (n = e.src.charCodeAt(s)) && 61 !== n || (s = e.skipChars(s, n),
                (s = e.skipSpaces(s)) < i || (s = e.bMarks[t] + e.tShift[t],
                e.line = o + 1,
                e.tokens.push({
                    type: "heading_open",
                    hLevel: 61 === n ? 1 : 2,
                    lines: [t, e.line],
                    level: e.level
                }),
                e.tokens.push({
                    type: "inline",
                    content: e.src.slice(s, e.eMarks[t]).trim(),
                    level: e.level + 1,
                    lines: [t, e.line - 1],
                    children: []
                }),
                e.tokens.push({
                    type: "heading_close",
                    hLevel: 61 === n ? 1 : 2,
                    level: e.level
                }),
                0)))
            }
        },
        5067(e) {
            "use strict";
            function t(e, t) {
                var r, n, s;
                return (n = e.bMarks[t] + e.tShift[t]) >= (s = e.eMarks[t]) || 42 !== (r = e.src.charCodeAt(n++)) && 45 !== r && 43 !== r || n < s && 32 !== e.src.charCodeAt(n) ? -1 : n
            }
            function r(e, t) {
                var r, n = e.bMarks[t] + e.tShift[t], s = e.eMarks[t];
                if (n + 1 >= s)
                    return -1;
                if ((r = e.src.charCodeAt(n++)) < 48 || r > 57)
                    return -1;
                for (; ; ) {
                    if (n >= s)
                        return -1;
                    if (!((r = e.src.charCodeAt(n++)) >= 48 && r <= 57)) {
                        if (41 === r || 46 === r)
                            break;
                        return -1
                    }
                }
                return n < s && 32 !== e.src.charCodeAt(n) ? -1 : n
            }
            e.exports = function(e, n, s, i) {
                var o, a, l, c, u, h, p, f, d, g, m, b, v, k, y, x, w, _, A, q, C, M = !0;
                if ((f = r(e, n)) >= 0)
                    b = !0;
                else {
                    if (!((f = t(e, n)) >= 0))
                        return !1;
                    b = !1
                }
                if (e.level >= e.options.maxNesting)
                    return !1;
                if (m = e.src.charCodeAt(f - 1),
                i)
                    return !0;
                for (k = e.tokens.length,
                b ? (p = e.bMarks[n] + e.tShift[n],
                g = Number(e.src.substr(p, f - p - 1)),
                e.tokens.push({
                    type: "ordered_list_open",
                    order: g,
                    lines: x = [n, 0],
                    level: e.level++
                })) : e.tokens.push({
                    type: "bullet_list_open",
                    lines: x = [n, 0],
                    level: e.level++
                }),
                o = n,
                y = !1,
                _ = e.parser.ruler.getRules("list"); !(!(o < s) || ((d = (v = e.skipSpaces(f)) >= e.eMarks[o] ? 1 : v - f) > 4 && (d = 1),
                d < 1 && (d = 1),
                a = f - e.bMarks[o] + d,
                e.tokens.push({
                    type: "list_item_open",
                    lines: w = [n, 0],
                    level: e.level++
                }),
                c = e.blkIndent,
                u = e.tight,
                l = e.tShift[n],
                h = e.parentType,
                e.tShift[n] = v - e.bMarks[n],
                e.blkIndent = a,
                e.tight = !0,
                e.parentType = "list",
                e.parser.tokenize(e, n, s, !0),
                e.tight && !y || (M = !1),
                y = e.line - n > 1 && e.isEmpty(e.line - 1),
                e.blkIndent = c,
                e.tShift[n] = l,
                e.tight = u,
                e.parentType = h,
                e.tokens.push({
                    type: "list_item_close",
                    level: --e.level
                }),
                o = n = e.line,
                w[1] = o,
                v = e.bMarks[n],
                o >= s) || e.isEmpty(o) || e.tShift[o] < e.blkIndent); ) {
                    for (C = !1,
                    A = 0,
                    q = _.length; A < q; A++)
                        if (_[A](e, o, s, !0)) {
                            C = !0;
                            break
                        }
                    if (C)
                        break;
                    if (b) {
                        if ((f = r(e, o)) < 0)
                            break
                    } else if ((f = t(e, o)) < 0)
                        break;
                    if (m !== e.src.charCodeAt(f - 1))
                        break
                }
                return e.tokens.push({
                    type: b ? "ordered_list_close" : "bullet_list_close",
                    level: --e.level
                }),
                x[1] = o,
                e.line = o,
                M && function(e, t) {
                    var r, n, s = e.level + 2;
                    for (r = t + 2,
                    n = e.tokens.length - 2; r < n; r++)
                        e.tokens[r].level === s && "paragraph_open" === e.tokens[r].type && (e.tokens[r + 2].tight = !0,
                        e.tokens[r].tight = !0,
                        r += 2)
                }(e, k),
                !0
            }
        },
        765(e) {
            "use strict";
            e.exports = function(e, t) {
                var r, n, s, i, o, a, l = t + 1;
                if (l < (r = e.lineMax) && !e.isEmpty(l))
                    for (a = e.parser.ruler.getRules("paragraph"); l < r && !e.isEmpty(l); l++)
                        if (!(e.tShift[l] - e.blkIndent > 3)) {
                            for (s = !1,
                            i = 0,
                            o = a.length; i < o; i++)
                                if (a[i](e, l, r, !0)) {
                                    s = !0;
                                    break
                                }
                            if (s)
                                break
                        }
                return n = e.getLines(t, l, e.blkIndent, !1).trim(),
                e.line = l,
                n.length && (e.tokens.push({
                    type: "paragraph_open",
                    tight: !1,
                    lines: [t, e.line],
                    level: e.level
                }),
                e.tokens.push({
                    type: "inline",
                    content: n,
                    level: e.level + 1,
                    lines: [t, e.line],
                    children: []
                }),
                e.tokens.push({
                    type: "paragraph_close",
                    tight: !1,
                    level: e.level
                })),
                !0
            }
        },
        5364(e) {
            "use strict";
            function t(e, t, r, n, s) {
                var i, o, a, l, c, u, h;
                for (this.src = e,
                this.parser = t,
                this.options = r,
                this.env = n,
                this.tokens = s,
                this.bMarks = [],
                this.eMarks = [],
                this.tShift = [],
                this.blkIndent = 0,
                this.line = 0,
                this.lineMax = 0,
                this.tight = !1,
                this.parentType = "root",
                this.ddIndent = -1,
                this.level = 0,
                this.result = "",
                u = 0,
                h = !1,
                a = l = u = 0,
                c = (o = this.src).length; l < c; l++) {
                    if (i = o.charCodeAt(l),
                    !h) {
                        if (32 === i) {
                            u++;
                            continue
                        }
                        h = !0
                    }
                    10 !== i && l !== c - 1 || (10 !== i && l++,
                    this.bMarks.push(a),
                    this.eMarks.push(l),
                    this.tShift.push(u),
                    h = !1,
                    u = 0,
                    a = l + 1)
                }
                this.bMarks.push(o.length),
                this.eMarks.push(o.length),
                this.tShift.push(0),
                this.lineMax = this.bMarks.length - 1
            }
            t.prototype.isEmpty = function(e) {
                return this.bMarks[e] + this.tShift[e] >= this.eMarks[e]
            }
            ,
            t.prototype.skipEmptyLines = function(e) {
                for (var t = this.lineMax; e < t && !(this.bMarks[e] + this.tShift[e] < this.eMarks[e]); e++)
                    ;
                return e
            }
            ,
            t.prototype.skipSpaces = function(e) {
                for (var t = this.src.length; e < t && 32 === this.src.charCodeAt(e); e++)
                    ;
                return e
            }
            ,
            t.prototype.skipChars = function(e, t) {
                for (var r = this.src.length; e < r && this.src.charCodeAt(e) === t; e++)
                    ;
                return e
            }
            ,
            t.prototype.skipCharsBack = function(e, t, r) {
                if (e <= r)
                    return e;
                for (; e > r; )
                    if (t !== this.src.charCodeAt(--e))
                        return e + 1;
                return e
            }
            ,
            t.prototype.getLines = function(e, t, r, n) {
                var s, i, o, a, l, c = e;
                if (e >= t)
                    return "";
                if (c + 1 === t)
                    return i = this.bMarks[c] + Math.min(this.tShift[c], r),
                    o = n ? this.eMarks[c] + 1 : this.eMarks[c],
                    this.src.slice(i, o);
                for (a = new Array(t - e),
                s = 0; c < t; c++,
                s++)
                    (l = this.tShift[c]) > r && (l = r),
                    l < 0 && (l = 0),
                    i = this.bMarks[c] + l,
                    o = c + 1 < t || n ? this.eMarks[c] + 1 : this.eMarks[c],
                    a[s] = this.src.slice(i, o);
                return a.join("")
            }
            ,
            e.exports = t
        },
        6735(e) {
            "use strict";
            function t(e, t) {
                var r = e.bMarks[t] + e.blkIndent
                  , n = e.eMarks[t];
                return e.src.substr(r, n - r)
            }
            e.exports = function(e, r, n, s) {
                var i, o, a, l, c, u, h, p, f, d, g;
                if (r + 2 > n)
                    return !1;
                if (c = r + 1,
                e.tShift[c] < e.blkIndent)
                    return !1;
                if ((a = e.bMarks[c] + e.tShift[c]) >= e.eMarks[c])
                    return !1;
                if (124 !== (i = e.src.charCodeAt(a)) && 45 !== i && 58 !== i)
                    return !1;
                if (o = t(e, r + 1),
                !/^[-:| ]+$/.test(o))
                    return !1;
                if ((u = o.split("|")) <= 2)
                    return !1;
                for (p = [],
                l = 0; l < u.length; l++) {
                    if (!(f = u[l].trim())) {
                        if (0 === l || l === u.length - 1)
                            continue;
                        return !1
                    }
                    if (!/^:?-+:?$/.test(f))
                        return !1;
                    58 === f.charCodeAt(f.length - 1) ? p.push(58 === f.charCodeAt(0) ? "center" : "right") : 58 === f.charCodeAt(0) ? p.push("left") : p.push("")
                }
                if (-1 === (o = t(e, r).trim()).indexOf("|"))
                    return !1;
                if (u = o.replace(/^\||\|$/g, "").split("|"),
                p.length !== u.length)
                    return !1;
                if (s)
                    return !0;
                for (e.tokens.push({
                    type: "table_open",
                    lines: d = [r, 0],
                    level: e.level++
                }),
                e.tokens.push({
                    type: "thead_open",
                    lines: [r, r + 1],
                    level: e.level++
                }),
                e.tokens.push({
                    type: "tr_open",
                    lines: [r, r + 1],
                    level: e.level++
                }),
                l = 0; l < u.length; l++)
                    e.tokens.push({
                        type: "th_open",
                        align: p[l],
                        lines: [r, r + 1],
                        level: e.level++
                    }),
                    e.tokens.push({
                        type: "inline",
                        content: u[l].trim(),
                        lines: [r, r + 1],
                        level: e.level,
                        children: []
                    }),
                    e.tokens.push({
                        type: "th_close",
                        level: --e.level
                    });
                for (e.tokens.push({
                    type: "tr_close",
                    level: --e.level
                }),
                e.tokens.push({
                    type: "thead_close",
                    level: --e.level
                }),
                e.tokens.push({
                    type: "tbody_open",
                    lines: g = [r + 2, 0],
                    level: e.level++
                }),
                c = r + 2; c < n && !(e.tShift[c] < e.blkIndent) && -1 !== (o = t(e, c).trim()).indexOf("|"); c++) {
                    for (u = o.replace(/^\||\|$/g, "").split("|"),
                    e.tokens.push({
                        type: "tr_open",
                        level: e.level++
                    }),
                    l = 0; l < u.length; l++)
                        e.tokens.push({
                            type: "td_open",
                            align: p[l],
                            level: e.level++
                        }),
                        h = u[l].substring(124 === u[l].charCodeAt(0) ? 1 : 0, 124 === u[l].charCodeAt(u[l].length - 1) ? u[l].length - 1 : u[l].length).trim(),
                        e.tokens.push({
                            type: "inline",
                            content: h,
                            level: e.level,
                            children: []
                        }),
                        e.tokens.push({
                            type: "td_close",
                            level: --e.level
                        });
                    e.tokens.push({
                        type: "tr_close",
                        level: --e.level
                    })
                }
                return e.tokens.push({
                    type: "tbody_close",
                    level: --e.level
                }),
                e.tokens.push({
                    type: "table_close",
                    level: --e.level
                }),
                d[1] = g[1] = c,
                e.line = c,
                !0
            }
        },
        5210(e, t, r) {
            "use strict";
            var n = r(8892)
              , s = r(2462);
            function i(e, t, r, i) {
                var o, a, l, c, u, h;
                if (42 !== e.charCodeAt(0))
                    return -1;
                if (91 !== e.charCodeAt(1))
                    return -1;
                if (-1 === e.indexOf("]:"))
                    return -1;
                if (o = new n(e,t,r,i,[]),
                (a = s(o, 1)) < 0 || 58 !== e.charCodeAt(a + 1))
                    return -1;
                for (c = o.posMax,
                l = a + 2; l < c && 10 !== o.src.charCodeAt(l); l++)
                    ;
                return u = e.slice(2, a),
                0 === (h = e.slice(a + 2, l).trim()).length ? -1 : (i.abbreviations || (i.abbreviations = {}),
                void 0 === i.abbreviations[":" + u] && (i.abbreviations[":" + u] = h),
                l)
            }
            e.exports = function(e) {
                var t, r, n, s, o = e.tokens;
                if (!e.inlineMode)
                    for (t = 1,
                    r = o.length - 1; t < r; t++)
                        if ("paragraph_open" === o[t - 1].type && "inline" === o[t].type && "paragraph_close" === o[t + 1].type) {
                            for (n = o[t].content; n.length && !((s = i(n, e.inline, e.options, e.env)) < 0); )
                                n = n.slice(s).trim();
                            o[t].content = n,
                            n.length || (o[t - 1].tight = !0,
                            o[t + 1].tight = !0)
                        }
            }
        },
        3402(e) {
            "use strict";
            var t = " \n()[]'\".,!?-";
            function r(e) {
                return e.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1")
            }
            e.exports = function(e) {
                var n, s, i, o, a, l, c, u, h, p, f, d, g = e.tokens;
                if (e.env.abbreviations)
                    for (e.env.abbrRegExp || (d = "(^|[" + t.split("").map(r).join("") + "])(" + Object.keys(e.env.abbreviations).map(function(e) {
                        return e.substr(1)
                    }).sort(function(e, t) {
                        return t.length - e.length
                    }).map(r).join("|") + ")($|[" + t.split("").map(r).join("") + "])",
                    e.env.abbrRegExp = new RegExp(d,"g")),
                    p = e.env.abbrRegExp,
                    s = 0,
                    i = g.length; s < i; s++)
                        if ("inline" === g[s].type)
                            for (n = (o = g[s].children).length - 1; n >= 0; n--)
                                if ("text" === (a = o[n]).type) {
                                    for (u = 0,
                                    l = a.content,
                                    p.lastIndex = 0,
                                    h = a.level,
                                    c = []; f = p.exec(l); )
                                        p.lastIndex > u && c.push({
                                            type: "text",
                                            content: l.slice(u, f.index + f[1].length),
                                            level: h
                                        }),
                                        c.push({
                                            type: "abbr_open",
                                            title: e.env.abbreviations[":" + f[2]],
                                            level: h++
                                        }),
                                        c.push({
                                            type: "text",
                                            content: f[2],
                                            level: h
                                        }),
                                        c.push({
                                            type: "abbr_close",
                                            level: --h
                                        }),
                                        u = p.lastIndex - f[3].length;
                                    c.length && (u < l.length && c.push({
                                        type: "text",
                                        content: l.slice(u),
                                        level: h
                                    }),
                                    g[s].children = o = [].concat(o.slice(0, n), c, o.slice(n + 1)))
                                }
            }
        },
        5420(e) {
            "use strict";
            e.exports = function(e) {
                e.inlineMode ? e.tokens.push({
                    type: "inline",
                    content: e.src.replace(/\n/g, " ").trim(),
                    level: 0,
                    lines: [0, 1],
                    children: []
                }) : e.block.parse(e.src, e.options, e.env, e.tokens)
            }
        },
        9426(e) {
            "use strict";
            e.exports = function(e) {
                var t, r, n, s, i, o, a, l, c, u = 0, h = !1, p = {};
                if (e.env.footnotes && (e.tokens = e.tokens.filter(function(e) {
                    return "footnote_reference_open" === e.type ? (h = !0,
                    l = [],
                    c = e.label,
                    !1) : "footnote_reference_close" === e.type ? (h = !1,
                    p[":" + c] = l,
                    !1) : (h && l.push(e),
                    !h)
                }),
                e.env.footnotes.list)) {
                    for (o = e.env.footnotes.list,
                    e.tokens.push({
                        type: "footnote_block_open",
                        level: u++
                    }),
                    t = 0,
                    r = o.length; t < r; t++) {
                        for (e.tokens.push({
                            type: "footnote_open",
                            id: t,
                            level: u++
                        }),
                        o[t].tokens ? ((a = []).push({
                            type: "paragraph_open",
                            tight: !1,
                            level: u++
                        }),
                        a.push({
                            type: "inline",
                            content: "",
                            level: u,
                            children: o[t].tokens
                        }),
                        a.push({
                            type: "paragraph_close",
                            tight: !1,
                            level: --u
                        })) : o[t].label && (a = p[":" + o[t].label]),
                        e.tokens = e.tokens.concat(a),
                        i = "paragraph_close" === e.tokens[e.tokens.length - 1].type ? e.tokens.pop() : null,
                        s = o[t].count > 0 ? o[t].count : 1,
                        n = 0; n < s; n++)
                            e.tokens.push({
                                type: "footnote_anchor",
                                id: t,
                                subId: n,
                                level: u
                            });
                        i && e.tokens.push(i),
                        e.tokens.push({
                            type: "footnote_close",
                            level: --u
                        })
                    }
                    e.tokens.push({
                        type: "footnote_block_close",
                        level: --u
                    })
                }
            }
        },
        3068(e) {
            "use strict";
            e.exports = function(e) {
                var t, r, n, s = e.tokens;
                for (r = 0,
                n = s.length; r < n; r++)
                    "inline" === (t = s[r]).type && e.inline.parse(t.content, e.options, e.env, t.children)
            }
        },
        1731(e, t, r) {
            "use strict";
            var n = r(460)
              , s = /www|@|\:\/\//;
            function i(e) {
                return /^<a[>\s]/i.test(e)
            }
            function o(e) {
                return /^<\/a\s*>/i.test(e)
            }
            function a() {
                var e = []
                  , t = new n({
                    stripPrefix: !1,
                    url: !0,
                    email: !0,
                    twitter: !1,
                    replaceFn: function(t, r) {
                        switch (r.getType()) {
                        case "url":
                            e.push({
                                text: r.matchedText,
                                url: r.getUrl()
                            });
                            break;
                        case "email":
                            e.push({
                                text: r.matchedText,
                                url: "mailto:" + r.getEmail().replace(/^mailto:/i, "")
                            })
                        }
                        return !1
                    }
                });
                return {
                    links: e,
                    autolinker: t
                }
            }
            e.exports = function(e) {
                var t, r, n, l, c, u, h, p, f, d, g, m, b, v = e.tokens, k = null;
                if (e.options.linkify)
                    for (r = 0,
                    n = v.length; r < n; r++)
                        if ("inline" === v[r].type)
                            for (g = 0,
                            t = (l = v[r].children).length - 1; t >= 0; t--)
                                if ("link_close" !== (c = l[t]).type) {
                                    if ("htmltag" === c.type && (i(c.content) && g > 0 && g--,
                                    o(c.content) && g++),
                                    !(g > 0) && "text" === c.type && s.test(c.content)) {
                                        if (k || (m = (k = a()).links,
                                        b = k.autolinker),
                                        u = c.content,
                                        m.length = 0,
                                        b.link(u),
                                        !m.length)
                                            continue;
                                        for (h = [],
                                        d = c.level,
                                        p = 0; p < m.length; p++)
                                            e.inline.validateLink(m[p].url) && ((f = u.indexOf(m[p].text)) && h.push({
                                                type: "text",
                                                content: u.slice(0, f),
                                                level: d
                                            }),
                                            h.push({
                                                type: "link_open",
                                                href: m[p].url,
                                                title: "",
                                                level: d++
                                            }),
                                            h.push({
                                                type: "text",
                                                content: m[p].text,
                                                level: d
                                            }),
                                            h.push({
                                                type: "link_close",
                                                level: --d
                                            }),
                                            u = u.slice(f + m[p].text.length));
                                        u.length && h.push({
                                            type: "text",
                                            content: u,
                                            level: d
                                        }),
                                        v[r].children = l = [].concat(l.slice(0, t), h, l.slice(t + 1))
                                    }
                                } else
                                    for (t--; l[t].level !== c.level && "link_open" !== l[t].type; )
                                        t--
            }
        },
        995(e, t, r) {
            "use strict";
            var n = r(8892)
              , s = r(2462)
              , i = r(4636)
              , o = r(2282)
              , a = r(9226);
            function l(e, t, r, l) {
                var c, u, h, p, f, d, g, m, b;
                if (91 !== e.charCodeAt(0))
                    return -1;
                if (-1 === e.indexOf("]:"))
                    return -1;
                if (c = new n(e,t,r,l,[]),
                (u = s(c, 0)) < 0 || 58 !== e.charCodeAt(u + 1))
                    return -1;
                for (p = c.posMax,
                h = u + 2; h < p && (32 === (f = c.src.charCodeAt(h)) || 10 === f); h++)
                    ;
                if (!i(c, h))
                    return -1;
                for (g = c.linkContent,
                d = h = c.pos,
                h += 1; h < p && (32 === (f = c.src.charCodeAt(h)) || 10 === f); h++)
                    ;
                for (h < p && d !== h && o(c, h) ? (m = c.linkContent,
                h = c.pos) : (m = "",
                h = d); h < p && 32 === c.src.charCodeAt(h); )
                    h++;
                return h < p && 10 !== c.src.charCodeAt(h) ? -1 : (b = a(e.slice(1, u)),
                void 0 === l.references[b] && (l.references[b] = {
                    title: m,
                    href: g
                }),
                h)
            }
            e.exports = function(e) {
                var t, r, n, s, i = e.tokens;
                if (e.env.references = e.env.references || {},
                !e.inlineMode)
                    for (t = 1,
                    r = i.length - 1; t < r; t++)
                        if ("inline" === i[t].type && "paragraph_open" === i[t - 1].type && "paragraph_close" === i[t + 1].type) {
                            for (n = i[t].content; n.length && !((s = l(n, e.inline, e.options, e.env)) < 0); )
                                n = n.slice(s).trim();
                            i[t].content = n,
                            n.length || (i[t - 1].tight = !0,
                            i[t + 1].tight = !0)
                        }
            }
        },
        8812(e) {
            "use strict";
            var t = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/
              , r = /\((c|tm|r|p)\)/gi
              , n = {
                c: "©",
                r: "®",
                p: "§",
                tm: "™"
            };
            function s(e) {
                return e.indexOf("(") < 0 ? e : e.replace(r, function(e, t) {
                    return n[t.toLowerCase()]
                })
            }
            e.exports = function(e) {
                var r, n, i, o, a;
                if (e.options.typographer)
                    for (a = e.tokens.length - 1; a >= 0; a--)
                        if ("inline" === e.tokens[a].type)
                            for (r = (o = e.tokens[a].children).length - 1; r >= 0; r--)
                                "text" === (n = o[r]).type && (i = s(i = n.content),
                                t.test(i) && (i = i.replace(/\+-/g, "±").replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---([^-]|$)/gm, "$1—$2").replace(/(^|\s)--(\s|$)/gm, "$1–$2").replace(/(^|[^-\s])--([^-\s]|$)/gm, "$1–$2")),
                                n.content = i)
            }
        },
        2713(e) {
            "use strict";
            var t = /['"]/
              , r = /['"]/g
              , n = /[-\s()\[\]]/;
            function s(e, t) {
                return !(t < 0 || t >= e.length || n.test(e[t]))
            }
            function i(e, t, r) {
                return e.substr(0, t) + r + e.substr(t + 1)
            }
            e.exports = function(e) {
                var n, o, a, l, c, u, h, p, f, d, g, m, b, v, k, y, x;
                if (e.options.typographer)
                    for (x = [],
                    k = e.tokens.length - 1; k >= 0; k--)
                        if ("inline" === e.tokens[k].type)
                            for (y = e.tokens[k].children,
                            x.length = 0,
                            n = 0; n < y.length; n++)
                                if ("text" === (o = y[n]).type && !t.test(o.text)) {
                                    for (h = y[n].level,
                                    b = x.length - 1; b >= 0 && !(x[b].level <= h); b--)
                                        ;
                                    x.length = b + 1,
                                    c = 0,
                                    u = (a = o.content).length;
                                    e: for (; c < u && (r.lastIndex = c,
                                    l = r.exec(a)); )
                                        if (p = !s(a, l.index - 1),
                                        c = l.index + 1,
                                        v = "'" === l[0],
                                        (f = !s(a, c)) || p) {
                                            if (g = !f,
                                            m = !p)
                                                for (b = x.length - 1; b >= 0 && (d = x[b],
                                                !(x[b].level < h)); b--)
                                                    if (d.single === v && x[b].level === h) {
                                                        d = x[b],
                                                        v ? (y[d.token].content = i(y[d.token].content, d.pos, e.options.quotes[2]),
                                                        o.content = i(o.content, l.index, e.options.quotes[3])) : (y[d.token].content = i(y[d.token].content, d.pos, e.options.quotes[0]),
                                                        o.content = i(o.content, l.index, e.options.quotes[1])),
                                                        x.length = b;
                                                        continue e
                                                    }
                                            g ? x.push({
                                                token: n,
                                                pos: l.index,
                                                single: v,
                                                level: h
                                            }) : m && v && (o.content = i(o.content, l.index, "’"))
                                        } else
                                            v && (o.content = i(o.content, l.index, "’"))
                                }
            }
        },
        6764(e, t, r) {
            "use strict";
            var n = r(4441)
              , s = r(3099)
              , i = /^<([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)>/
              , o = /^<([a-zA-Z.\-]{1,25}):([^<>\x00-\x20]*)>/;
            e.exports = function(e, t) {
                var r, a, l, c, u, h = e.pos;
                return !(60 !== e.src.charCodeAt(h) || (r = e.src.slice(h)).indexOf(">") < 0 || ((a = r.match(o)) ? n.indexOf(a[1].toLowerCase()) < 0 || (c = a[0].slice(1, -1),
                u = s(c),
                !e.parser.validateLink(c) || (t || (e.push({
                    type: "link_open",
                    href: u,
                    level: e.level
                }),
                e.push({
                    type: "text",
                    content: c,
                    level: e.level + 1
                }),
                e.push({
                    type: "link_close",
                    level: e.level
                })),
                e.pos += a[0].length,
                0)) : !(l = r.match(i)) || (c = l[0].slice(1, -1),
                u = s("mailto:" + c),
                !e.parser.validateLink(u) || (t || (e.push({
                    type: "link_open",
                    href: u,
                    level: e.level
                }),
                e.push({
                    type: "text",
                    content: c,
                    level: e.level + 1
                }),
                e.push({
                    type: "link_close",
                    level: e.level
                })),
                e.pos += l[0].length,
                0))))
            }
        },
        3108(e) {
            "use strict";
            e.exports = function(e, t) {
                var r, n, s, i, o, a = e.pos;
                if (96 !== e.src.charCodeAt(a))
                    return !1;
                for (r = a,
                a++,
                n = e.posMax; a < n && 96 === e.src.charCodeAt(a); )
                    a++;
                for (s = e.src.slice(r, a),
                i = o = a; -1 !== (i = e.src.indexOf("`", o)); ) {
                    for (o = i + 1; o < n && 96 === e.src.charCodeAt(o); )
                        o++;
                    if (o - i === s.length)
                        return t || e.push({
                            type: "code",
                            content: e.src.slice(a, i).replace(/[ \n]+/g, " ").trim(),
                            block: !1,
                            level: e.level
                        }),
                        e.pos = o,
                        !0
                }
                return t || (e.pending += s),
                e.pos += s.length,
                !0
            }
        },
        3506(e) {
            "use strict";
            e.exports = function(e, t) {
                var r, n, s, i, o, a = e.posMax, l = e.pos;
                if (126 !== e.src.charCodeAt(l))
                    return !1;
                if (t)
                    return !1;
                if (l + 4 >= a)
                    return !1;
                if (126 !== e.src.charCodeAt(l + 1))
                    return !1;
                if (e.level >= e.options.maxNesting)
                    return !1;
                if (i = l > 0 ? e.src.charCodeAt(l - 1) : -1,
                o = e.src.charCodeAt(l + 2),
                126 === i)
                    return !1;
                if (126 === o)
                    return !1;
                if (32 === o || 10 === o)
                    return !1;
                for (n = l + 2; n < a && 126 === e.src.charCodeAt(n); )
                    n++;
                if (n > l + 3)
                    return e.pos += n - l,
                    t || (e.pending += e.src.slice(l, n)),
                    !0;
                for (e.pos = l + 2,
                s = 1; e.pos + 1 < a; ) {
                    if (126 === e.src.charCodeAt(e.pos) && 126 === e.src.charCodeAt(e.pos + 1) && (i = e.src.charCodeAt(e.pos - 1),
                    126 !== (o = e.pos + 2 < a ? e.src.charCodeAt(e.pos + 2) : -1) && 126 !== i && (32 !== i && 10 !== i ? s-- : 32 !== o && 10 !== o && s++,
                    s <= 0))) {
                        r = !0;
                        break
                    }
                    e.parser.skipToken(e)
                }
                return r ? (e.posMax = e.pos,
                e.pos = l + 2,
                t || (e.push({
                    type: "del_open",
                    level: e.level++
                }),
                e.parser.tokenize(e),
                e.push({
                    type: "del_close",
                    level: --e.level
                })),
                e.pos = e.posMax + 2,
                e.posMax = a,
                !0) : (e.pos = l,
                !1)
            }
        },
        1285(e) {
            "use strict";
            function t(e) {
                return e >= 48 && e <= 57 || e >= 65 && e <= 90 || e >= 97 && e <= 122
            }
            function r(e, r) {
                var n, s, i, o = r, a = !0, l = !0, c = e.posMax, u = e.src.charCodeAt(r);
                for (n = r > 0 ? e.src.charCodeAt(r - 1) : -1; o < c && e.src.charCodeAt(o) === u; )
                    o++;
                return o >= c && (a = !1),
                (i = o - r) >= 4 ? a = l = !1 : (32 !== (s = o < c ? e.src.charCodeAt(o) : -1) && 10 !== s || (a = !1),
                32 !== n && 10 !== n || (l = !1),
                95 === u && (t(n) && (a = !1),
                t(s) && (l = !1))),
                {
                    can_open: a,
                    can_close: l,
                    delims: i
                }
            }
            e.exports = function(e, t) {
                var n, s, i, o, a, l, c, u = e.posMax, h = e.pos, p = e.src.charCodeAt(h);
                if (95 !== p && 42 !== p)
                    return !1;
                if (t)
                    return !1;
                if (n = (c = r(e, h)).delims,
                !c.can_open)
                    return e.pos += n,
                    t || (e.pending += e.src.slice(h, e.pos)),
                    !0;
                if (e.level >= e.options.maxNesting)
                    return !1;
                for (e.pos = h + n,
                l = [n]; e.pos < u; )
                    if (e.src.charCodeAt(e.pos) !== p)
                        e.parser.skipToken(e);
                    else {
                        if (s = (c = r(e, e.pos)).delims,
                        c.can_close) {
                            for (o = l.pop(),
                            a = s; o !== a; ) {
                                if (a < o) {
                                    l.push(o - a);
                                    break
                                }
                                if (a -= o,
                                0 === l.length)
                                    break;
                                e.pos += o,
                                o = l.pop()
                            }
                            if (0 === l.length) {
                                n = o,
                                i = !0;
                                break
                            }
                            e.pos += s;
                            continue
                        }
                        c.can_open && l.push(s),
                        e.pos += s
                    }
                return i ? (e.posMax = e.pos,
                e.pos = h + n,
                t || (2 !== n && 3 !== n || e.push({
                    type: "strong_open",
                    level: e.level++
                }),
                1 !== n && 3 !== n || e.push({
                    type: "em_open",
                    level: e.level++
                }),
                e.parser.tokenize(e),
                1 !== n && 3 !== n || e.push({
                    type: "em_close",
                    level: --e.level
                }),
                2 !== n && 3 !== n || e.push({
                    type: "strong_close",
                    level: --e.level
                })),
                e.pos = e.posMax + n,
                e.posMax = u,
                !0) : (e.pos = h,
                !1)
            }
        },
        188(e, t, r) {
            "use strict";
            var n = r(3332)
              , s = r(6562).has
              , i = r(6562).isValidEntityCode
              , o = r(6562).fromCodePoint
              , a = /^&#((?:x[a-f0-9]{1,8}|[0-9]{1,8}));/i
              , l = /^&([a-z][a-z0-9]{1,31});/i;
            e.exports = function(e, t) {
                var r, c, u = e.pos, h = e.posMax;
                if (38 !== e.src.charCodeAt(u))
                    return !1;
                if (u + 1 < h)
                    if (35 === e.src.charCodeAt(u + 1)) {
                        if (c = e.src.slice(u).match(a))
                            return t || (r = "x" === c[1][0].toLowerCase() ? parseInt(c[1].slice(1), 16) : parseInt(c[1], 10),
                            e.pending += i(r) ? o(r) : o(65533)),
                            e.pos += c[0].length,
                            !0
                    } else if ((c = e.src.slice(u).match(l)) && s(n, c[1]))
                        return t || (e.pending += n[c[1]]),
                        e.pos += c[0].length,
                        !0;
                return t || (e.pending += "&"),
                e.pos++,
                !0
            }
        },
        5780(e) {
            "use strict";
            for (var t = [], r = 0; r < 256; r++)
                t.push(0);
            "\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(e) {
                t[e.charCodeAt(0)] = 1
            }),
            e.exports = function(e, r) {
                var n, s = e.pos, i = e.posMax;
                if (92 !== e.src.charCodeAt(s))
                    return !1;
                if (++s < i) {
                    if ((n = e.src.charCodeAt(s)) < 256 && 0 !== t[n])
                        return r || (e.pending += e.src[s]),
                        e.pos += 2,
                        !0;
                    if (10 === n) {
                        for (r || e.push({
                            type: "hardbreak",
                            level: e.level
                        }),
                        s++; s < i && 32 === e.src.charCodeAt(s); )
                            s++;
                        return e.pos = s,
                        !0
                    }
                }
                return r || (e.pending += "\\"),
                e.pos++,
                !0
            }
        },
        479(e, t, r) {
            "use strict";
            var n = r(2462);
            e.exports = function(e, t) {
                var r, s, i, o, a = e.posMax, l = e.pos;
                return !(l + 2 >= a || 94 !== e.src.charCodeAt(l) || 91 !== e.src.charCodeAt(l + 1) || e.level >= e.options.maxNesting || (r = l + 2,
                (s = n(e, l + 1)) < 0 || (t || (e.env.footnotes || (e.env.footnotes = {}),
                e.env.footnotes.list || (e.env.footnotes.list = []),
                i = e.env.footnotes.list.length,
                e.pos = r,
                e.posMax = s,
                e.push({
                    type: "footnote_ref",
                    id: i,
                    level: e.level
                }),
                e.linkLevel++,
                o = e.tokens.length,
                e.parser.tokenize(e),
                e.env.footnotes.list[i] = {
                    tokens: e.tokens.splice(o)
                },
                e.linkLevel--),
                e.pos = s + 1,
                e.posMax = a,
                0)))
            }
        },
        1977(e) {
            "use strict";
            e.exports = function(e, t) {
                var r, n, s, i, o = e.posMax, a = e.pos;
                if (a + 3 > o)
                    return !1;
                if (!e.env.footnotes || !e.env.footnotes.refs)
                    return !1;
                if (91 !== e.src.charCodeAt(a))
                    return !1;
                if (94 !== e.src.charCodeAt(a + 1))
                    return !1;
                if (e.level >= e.options.maxNesting)
                    return !1;
                for (n = a + 2; n < o; n++) {
                    if (32 === e.src.charCodeAt(n))
                        return !1;
                    if (10 === e.src.charCodeAt(n))
                        return !1;
                    if (93 === e.src.charCodeAt(n))
                        break
                }
                return !(n === a + 2 || n >= o || (n++,
                r = e.src.slice(a + 2, n - 1),
                void 0 === e.env.footnotes.refs[":" + r] || (t || (e.env.footnotes.list || (e.env.footnotes.list = []),
                e.env.footnotes.refs[":" + r] < 0 ? (s = e.env.footnotes.list.length,
                e.env.footnotes.list[s] = {
                    label: r,
                    count: 0
                },
                e.env.footnotes.refs[":" + r] = s) : s = e.env.footnotes.refs[":" + r],
                i = e.env.footnotes.list[s].count,
                e.env.footnotes.list[s].count++,
                e.push({
                    type: "footnote_ref",
                    id: s,
                    subId: i,
                    level: e.level
                })),
                e.pos = n,
                e.posMax = o,
                0)))
            }
        },
        4916(e, t, r) {
            "use strict";
            var n = r(8364).l;
            e.exports = function(e, t) {
                var r, s, i, o = e.pos;
                return !(!e.options.html || (i = e.posMax,
                60 !== e.src.charCodeAt(o) || o + 2 >= i || 33 !== (r = e.src.charCodeAt(o + 1)) && 63 !== r && 47 !== r && !function(e) {
                    var t = 32 | e;
                    return t >= 97 && t <= 122
                }(r) || !(s = e.src.slice(o).match(n)) || (t || e.push({
                    type: "htmltag",
                    content: e.src.slice(o, o + s[0].length),
                    level: e.level
                }),
                e.pos += s[0].length,
                0)))
            }
        },
        7527(e) {
            "use strict";
            e.exports = function(e, t) {
                var r, n, s, i, o, a = e.posMax, l = e.pos;
                if (43 !== e.src.charCodeAt(l))
                    return !1;
                if (t)
                    return !1;
                if (l + 4 >= a)
                    return !1;
                if (43 !== e.src.charCodeAt(l + 1))
                    return !1;
                if (e.level >= e.options.maxNesting)
                    return !1;
                if (i = l > 0 ? e.src.charCodeAt(l - 1) : -1,
                o = e.src.charCodeAt(l + 2),
                43 === i)
                    return !1;
                if (43 === o)
                    return !1;
                if (32 === o || 10 === o)
                    return !1;
                for (n = l + 2; n < a && 43 === e.src.charCodeAt(n); )
                    n++;
                if (n !== l + 2)
                    return e.pos += n - l,
                    t || (e.pending += e.src.slice(l, n)),
                    !0;
                for (e.pos = l + 2,
                s = 1; e.pos + 1 < a; ) {
                    if (43 === e.src.charCodeAt(e.pos) && 43 === e.src.charCodeAt(e.pos + 1) && (i = e.src.charCodeAt(e.pos - 1),
                    43 !== (o = e.pos + 2 < a ? e.src.charCodeAt(e.pos + 2) : -1) && 43 !== i && (32 !== i && 10 !== i ? s-- : 32 !== o && 10 !== o && s++,
                    s <= 0))) {
                        r = !0;
                        break
                    }
                    e.parser.skipToken(e)
                }
                return r ? (e.posMax = e.pos,
                e.pos = l + 2,
                t || (e.push({
                    type: "ins_open",
                    level: e.level++
                }),
                e.parser.tokenize(e),
                e.push({
                    type: "ins_close",
                    level: --e.level
                })),
                e.pos = e.posMax + 2,
                e.posMax = a,
                !0) : (e.pos = l,
                !1)
            }
        },
        9630(e, t, r) {
            "use strict";
            var n = r(2462)
              , s = r(4636)
              , i = r(2282)
              , o = r(9226);
            e.exports = function(e, t) {
                var r, a, l, c, u, h, p, f, d = !1, g = e.pos, m = e.posMax, b = e.pos, v = e.src.charCodeAt(b);
                if (33 === v && (d = !0,
                v = e.src.charCodeAt(++b)),
                91 !== v)
                    return !1;
                if (e.level >= e.options.maxNesting)
                    return !1;
                if (r = b + 1,
                (a = n(e, b)) < 0)
                    return !1;
                if ((h = a + 1) < m && 40 === e.src.charCodeAt(h)) {
                    for (h++; h < m && (32 === (f = e.src.charCodeAt(h)) || 10 === f); h++)
                        ;
                    if (h >= m)
                        return !1;
                    for (b = h,
                    s(e, h) ? (c = e.linkContent,
                    h = e.pos) : c = "",
                    b = h; h < m && (32 === (f = e.src.charCodeAt(h)) || 10 === f); h++)
                        ;
                    if (h < m && b !== h && i(e, h))
                        for (u = e.linkContent,
                        h = e.pos; h < m && (32 === (f = e.src.charCodeAt(h)) || 10 === f); h++)
                            ;
                    else
                        u = "";
                    if (h >= m || 41 !== e.src.charCodeAt(h))
                        return e.pos = g,
                        !1;
                    h++
                } else {
                    if (e.linkLevel > 0)
                        return !1;
                    for (; h < m && (32 === (f = e.src.charCodeAt(h)) || 10 === f); h++)
                        ;
                    if (h < m && 91 === e.src.charCodeAt(h) && (b = h + 1,
                    (h = n(e, h)) >= 0 ? l = e.src.slice(b, h++) : h = b - 1),
                    l || (void 0 === l && (h = a + 1),
                    l = e.src.slice(r, a)),
                    !(p = e.env.references[o(l)]))
                        return e.pos = g,
                        !1;
                    c = p.href,
                    u = p.title
                }
                return t || (e.pos = r,
                e.posMax = a,
                d ? e.push({
                    type: "image",
                    src: c,
                    title: u,
                    alt: e.src.substr(r, a - r),
                    level: e.level
                }) : (e.push({
                    type: "link_open",
                    href: c,
                    title: u,
                    level: e.level++
                }),
                e.linkLevel++,
                e.parser.tokenize(e),
                e.linkLevel--,
                e.push({
                    type: "link_close",
                    level: --e.level
                }))),
                e.pos = h,
                e.posMax = m,
                !0
            }
        },
        8758(e) {
            "use strict";
            e.exports = function(e, t) {
                var r, n, s, i, o, a = e.posMax, l = e.pos;
                if (61 !== e.src.charCodeAt(l))
                    return !1;
                if (t)
                    return !1;
                if (l + 4 >= a)
                    return !1;
                if (61 !== e.src.charCodeAt(l + 1))
                    return !1;
                if (e.level >= e.options.maxNesting)
                    return !1;
                if (i = l > 0 ? e.src.charCodeAt(l - 1) : -1,
                o = e.src.charCodeAt(l + 2),
                61 === i)
                    return !1;
                if (61 === o)
                    return !1;
                if (32 === o || 10 === o)
                    return !1;
                for (n = l + 2; n < a && 61 === e.src.charCodeAt(n); )
                    n++;
                if (n !== l + 2)
                    return e.pos += n - l,
                    t || (e.pending += e.src.slice(l, n)),
                    !0;
                for (e.pos = l + 2,
                s = 1; e.pos + 1 < a; ) {
                    if (61 === e.src.charCodeAt(e.pos) && 61 === e.src.charCodeAt(e.pos + 1) && (i = e.src.charCodeAt(e.pos - 1),
                    61 !== (o = e.pos + 2 < a ? e.src.charCodeAt(e.pos + 2) : -1) && 61 !== i && (32 !== i && 10 !== i ? s-- : 32 !== o && 10 !== o && s++,
                    s <= 0))) {
                        r = !0;
                        break
                    }
                    e.parser.skipToken(e)
                }
                return r ? (e.posMax = e.pos,
                e.pos = l + 2,
                t || (e.push({
                    type: "mark_open",
                    level: e.level++
                }),
                e.parser.tokenize(e),
                e.push({
                    type: "mark_close",
                    level: --e.level
                })),
                e.pos = e.posMax + 2,
                e.posMax = a,
                !0) : (e.pos = l,
                !1)
            }
        },
        9319(e) {
            "use strict";
            e.exports = function(e, t) {
                var r, n, s = e.pos;
                if (10 !== e.src.charCodeAt(s))
                    return !1;
                if (r = e.pending.length - 1,
                n = e.posMax,
                !t)
                    if (r >= 0 && 32 === e.pending.charCodeAt(r))
                        if (r >= 1 && 32 === e.pending.charCodeAt(r - 1)) {
                            for (var i = r - 2; i >= 0; i--)
                                if (32 !== e.pending.charCodeAt(i)) {
                                    e.pending = e.pending.substring(0, i + 1);
                                    break
                                }
                            e.push({
                                type: "hardbreak",
                                level: e.level
                            })
                        } else
                            e.pending = e.pending.slice(0, -1),
                            e.push({
                                type: "softbreak",
                                level: e.level
                            });
                    else
                        e.push({
                            type: "softbreak",
                            level: e.level
                        });
                for (s++; s < n && 32 === e.src.charCodeAt(s); )
                    s++;
                return e.pos = s,
                !0
            }
        },
        8892(e) {
            "use strict";
            function t(e, t, r, n, s) {
                this.src = e,
                this.env = n,
                this.options = r,
                this.parser = t,
                this.tokens = s,
                this.pos = 0,
                this.posMax = this.src.length,
                this.level = 0,
                this.pending = "",
                this.pendingLevel = 0,
                this.cache = [],
                this.isInLabel = !1,
                this.linkLevel = 0,
                this.linkContent = "",
                this.labelUnmatchedScopes = 0
            }
            t.prototype.pushPending = function() {
                this.tokens.push({
                    type: "text",
                    content: this.pending,
                    level: this.pendingLevel
                }),
                this.pending = ""
            }
            ,
            t.prototype.push = function(e) {
                this.pending && this.pushPending(),
                this.tokens.push(e),
                this.pendingLevel = this.level
            }
            ,
            t.prototype.cacheSet = function(e, t) {
                for (var r = this.cache.length; r <= e; r++)
                    this.cache.push(0);
                this.cache[e] = t
            }
            ,
            t.prototype.cacheGet = function(e) {
                return e < this.cache.length ? this.cache[e] : 0
            }
            ,
            e.exports = t
        },
        2049(e) {
            "use strict";
            var t = /\\([ \\!"#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g;
            e.exports = function(e, r) {
                var n, s, i = e.posMax, o = e.pos;
                if (126 !== e.src.charCodeAt(o))
                    return !1;
                if (r)
                    return !1;
                if (o + 2 >= i)
                    return !1;
                if (e.level >= e.options.maxNesting)
                    return !1;
                for (e.pos = o + 1; e.pos < i; ) {
                    if (126 === e.src.charCodeAt(e.pos)) {
                        n = !0;
                        break
                    }
                    e.parser.skipToken(e)
                }
                return n && o + 1 !== e.pos ? (s = e.src.slice(o + 1, e.pos)).match(/(^|[^\\])(\\\\)*\s/) ? (e.pos = o,
                !1) : (e.posMax = e.pos,
                e.pos = o + 1,
                r || e.push({
                    type: "sub",
                    level: e.level,
                    content: s.replace(t, "$1")
                }),
                e.pos = e.posMax + 1,
                e.posMax = i,
                !0) : (e.pos = o,
                !1)
            }
        },
        3071(e) {
            "use strict";
            var t = /\\([ \\!"#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g;
            e.exports = function(e, r) {
                var n, s, i = e.posMax, o = e.pos;
                if (94 !== e.src.charCodeAt(o))
                    return !1;
                if (r)
                    return !1;
                if (o + 2 >= i)
                    return !1;
                if (e.level >= e.options.maxNesting)
                    return !1;
                for (e.pos = o + 1; e.pos < i; ) {
                    if (94 === e.src.charCodeAt(e.pos)) {
                        n = !0;
                        break
                    }
                    e.parser.skipToken(e)
                }
                return n && o + 1 !== e.pos ? (s = e.src.slice(o + 1, e.pos)).match(/(^|[^\\])(\\\\)*\s/) ? (e.pos = o,
                !1) : (e.posMax = e.pos,
                e.pos = o + 1,
                r || e.push({
                    type: "sup",
                    level: e.level,
                    content: s.replace(t, "$1")
                }),
                e.pos = e.posMax + 1,
                e.posMax = i,
                !0) : (e.pos = o,
                !1)
            }
        },
        7344(e) {
            "use strict";
            function t(e) {
                switch (e) {
                case 10:
                case 92:
                case 96:
                case 42:
                case 95:
                case 94:
                case 91:
                case 93:
                case 33:
                case 38:
                case 60:
                case 62:
                case 123:
                case 125:
                case 36:
                case 37:
                case 64:
                case 126:
                case 43:
                case 61:
                case 58:
                    return !0;
                default:
                    return !1
                }
            }
            e.exports = function(e, r) {
                for (var n = e.pos; n < e.posMax && !t(e.src.charCodeAt(n)); )
                    n++;
                return n !== e.pos && (r || (e.pending += e.src.slice(e.pos, n)),
                e.pos = n,
                !0)
            }
        },
        3893(t) {
            "use strict";
            t.exports = e
        }
    },
    r = {},
    function e(n) {
        var s = r[n];
        if (void 0 !== s)
            return s.exports;
        var i = r[n] = {
            exports: {}
        };
        return t[n].call(i.exports, i, i.exports, e),
        i.exports
    }(4764);
    var t, r
}
);
