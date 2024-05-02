// To parse this data:
//
//   import { Convert, Translate } from "./file";
//
//   const translate = Convert.toTranslate(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Translate {
    localbooker:     Localbooker;
    firstDayOfWeek:  number;
    dayNames:        string[];
    dayNamesShort:   string[];
    dayNamesMin:     string[];
    monthNames:      string[];
    monthNamesShort: string[];
}

export interface Localbooker {
    labels:       LocalbookerLabels;
    countries:    Country[];
    mainFilter:   MainFilter;
    subFilter:    SubFilter;
    cart:         Cart;
    stripe:       Stripe;
    page_pdp:     PagePDP;
    page_spa:     PageSPA;
    page_confirm: PageConfirm;
    page_form:    PageForm;
}

export interface Cart {
    night:     string;
    total:     string;
    subtotal:  string;
    pay_now:   string;
    pay_later: string;
}

export interface Country {
    label: string;
    value: string;
}

export interface LocalbookerLabels {
    go_to:            string;
    go_back:          string;
    more_info:        string;
    select_dates:     string;
    show_pricing:     string;
    go_book:          string;
    not_available:    string;
    choose_your_room: string;
    from_night:       string;
    guest:            string;
    guests:           string;
    adults:           string;
    adult:            string;
    children:         string;
    child:            string;
    babys:            string;
    baby:             string;
    pet:              string;
    pets:             string;
    confirm_booking:  string;
    confirm_and_pay:  string;
}

export interface MainFilter {
    where:           string;
    when:            string;
    type:            string;
    who:             string;
    "Heel Zeeland":  string;
    selectdate:      string;
    selecttype:      string;
    selectguest:     string;
    regions:         string;
    destinations:    string;
    choose_checkin:  string;
    choose_checkout: string;
}

export interface PageConfirm {
    almost_ready:             string;
    check_booking:            string;
    booked_by:                string;
    more_details:             string;
    pay:                      string;
    confirm:                  string;
    terms_and_conditions_1:   string;
    terms_and_conditions_2:   string;
    terms_and_conditions_pdf: string;
    error_header:             string;
    error_message:            string;
}

export interface PageForm {
    labels:      PageFormLabels;
    naw:         Naw;
    placeholder: Naw;
    label:       Label;
}

export interface Label {
    optional:     string;
    is_mandatory: string;
    is_wrong:     string;
}

export interface PageFormLabels {
    almost_ready:   string;
    travel_company: string;
    occupancy:      string;
    max_occupancy:  string;
    fill_the_form:  string;
    extra_info_1:   string;
    extra_info_2:   string;
    privacy_1:      string;
    privacy_2:      string;
    privacy_path:   string;
}

export interface Naw {
    first_name:   string;
    last_name:    string;
    email:        string;
    phone_number: string;
    zip_code:     string;
    house_number: string;
    street:       string;
    city:         string;
    country:      string;
    iban:         null;
}

export interface PagePDP {
    full_description:    string;
    cancel_conditions:   string;
    payment_conditions:  string;
    check_in_out_info:   string;
    between:             string;
    uur_en:              string;
    hour:                string;
    check_in:            string;
    check_out:           string;
    before:              string;
    house_rules:         string;
    when:                string;
    how_many:            string;
    select_dates:        string;
    checkin_checkout:    string;
    guests:              string;
    tc_admin_label:      string;
    tc_admin_body:       string;
    tc_admin_link_label: string;
}

export interface PageSPA {
    map:           string;
    list:          string;
    accos_found:   string;
    filterOptions: Country[];
}

export interface Stripe {
    pay:          string;
    close_stripe: string;
}

export interface SubFilter {
    more:                  string;
    less:                  string;
    find_the_perfect_spot: string;
    reset_filters:         string;
    your_filters:          string;
    show_results:          string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toTranslate(json: string): Translate {
        return cast(JSON.parse(json), r("Translate"));
    }

    public static translateToJson(value: Translate): string {
        return JSON.stringify(uncast(value, r("Translate")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "Translate": o([
        { json: "localbooker", js: "localbooker", typ: r("Localbooker") },
        { json: "firstDayOfWeek", js: "firstDayOfWeek", typ: 0 },
        { json: "dayNames", js: "dayNames", typ: a("") },
        { json: "dayNamesShort", js: "dayNamesShort", typ: a("") },
        { json: "dayNamesMin", js: "dayNamesMin", typ: a("") },
        { json: "monthNames", js: "monthNames", typ: a("") },
        { json: "monthNamesShort", js: "monthNamesShort", typ: a("") },
    ], false),
    "Localbooker": o([
        { json: "labels", js: "labels", typ: r("LocalbookerLabels") },
        { json: "countries", js: "countries", typ: a(r("Country")) },
        { json: "mainFilter", js: "mainFilter", typ: r("MainFilter") },
        { json: "subFilter", js: "subFilter", typ: r("SubFilter") },
        { json: "cart", js: "cart", typ: r("Cart") },
        { json: "stripe", js: "stripe", typ: r("Stripe") },
        { json: "page_pdp", js: "page_pdp", typ: r("PagePDP") },
        { json: "page_spa", js: "page_spa", typ: r("PageSPA") },
        { json: "page_confirm", js: "page_confirm", typ: r("PageConfirm") },
        { json: "page_form", js: "page_form", typ: r("PageForm") },
    ], false),
    "Cart": o([
        { json: "night", js: "night", typ: "" },
        { json: "total", js: "total", typ: "" },
        { json: "subtotal", js: "subtotal", typ: "" },
        { json: "pay_now", js: "pay_now", typ: "" },
        { json: "pay_later", js: "pay_later", typ: "" },
    ], false),
    "Country": o([
        { json: "label", js: "label", typ: "" },
        { json: "value", js: "value", typ: "" },
    ], false),
    "LocalbookerLabels": o([
        { json: "go_to", js: "go_to", typ: "" },
        { json: "go_back", js: "go_back", typ: "" },
        { json: "more_info", js: "more_info", typ: "" },
        { json: "select_dates", js: "select_dates", typ: "" },
        { json: "show_pricing", js: "show_pricing", typ: "" },
        { json: "go_book", js: "go_book", typ: "" },
        { json: "not_available", js: "not_available", typ: "" },
        { json: "choose_your_room", js: "choose_your_room", typ: "" },
        { json: "from_night", js: "from_night", typ: "" },
        { json: "guest", js: "guest", typ: "" },
        { json: "guests", js: "guests", typ: "" },
        { json: "adults", js: "adults", typ: "" },
        { json: "adult", js: "adult", typ: "" },
        { json: "children", js: "children", typ: "" },
        { json: "child", js: "child", typ: "" },
        { json: "babys", js: "babys", typ: "" },
        { json: "baby", js: "baby", typ: "" },
        { json: "pet", js: "pet", typ: "" },
        { json: "pets", js: "pets", typ: "" },
        { json: "confirm_booking", js: "confirm_booking", typ: "" },
        { json: "confirm_and_pay", js: "confirm_and_pay", typ: "" },
    ], false),
    "MainFilter": o([
        { json: "where", js: "where", typ: "" },
        { json: "when", js: "when", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "who", js: "who", typ: "" },
        { json: "Heel Zeeland", js: "Heel Zeeland", typ: "" },
        { json: "selectdate", js: "selectdate", typ: "" },
        { json: "selecttype", js: "selecttype", typ: "" },
        { json: "selectguest", js: "selectguest", typ: "" },
        { json: "regions", js: "regions", typ: "" },
        { json: "destinations", js: "destinations", typ: "" },
        { json: "choose_checkin", js: "choose_checkin", typ: "" },
        { json: "choose_checkout", js: "choose_checkout", typ: "" },
    ], false),
    "PageConfirm": o([
        { json: "almost_ready", js: "almost_ready", typ: "" },
        { json: "check_booking", js: "check_booking", typ: "" },
        { json: "booked_by", js: "booked_by", typ: "" },
        { json: "more_details", js: "more_details", typ: "" },
        { json: "pay", js: "pay", typ: "" },
        { json: "confirm", js: "confirm", typ: "" },
        { json: "terms_and_conditions_1", js: "terms_and_conditions_1", typ: "" },
        { json: "terms_and_conditions_2", js: "terms_and_conditions_2", typ: "" },
        { json: "terms_and_conditions_pdf", js: "terms_and_conditions_pdf", typ: "" },
        { json: "error_header", js: "error_header", typ: "" },
        { json: "error_message", js: "error_message", typ: "" },
    ], false),
    "PageForm": o([
        { json: "labels", js: "labels", typ: r("PageFormLabels") },
        { json: "naw", js: "naw", typ: r("Naw") },
        { json: "placeholder", js: "placeholder", typ: r("Naw") },
        { json: "label", js: "label", typ: r("Label") },
    ], false),
    "Label": o([
        { json: "optional", js: "optional", typ: "" },
        { json: "is_mandatory", js: "is_mandatory", typ: "" },
        { json: "is_wrong", js: "is_wrong", typ: "" },
    ], false),
    "PageFormLabels": o([
        { json: "almost_ready", js: "almost_ready", typ: "" },
        { json: "travel_company", js: "travel_company", typ: "" },
        { json: "occupancy", js: "occupancy", typ: "" },
        { json: "max_occupancy", js: "max_occupancy", typ: "" },
        { json: "fill_the_form", js: "fill_the_form", typ: "" },
        { json: "extra_info_1", js: "extra_info_1", typ: "" },
        { json: "extra_info_2", js: "extra_info_2", typ: "" },
        { json: "privacy_1", js: "privacy_1", typ: "" },
        { json: "privacy_2", js: "privacy_2", typ: "" },
        { json: "privacy_path", js: "privacy_path", typ: "" },
    ], false),
    "Naw": o([
        { json: "first_name", js: "first_name", typ: "" },
        { json: "last_name", js: "last_name", typ: "" },
        { json: "email", js: "email", typ: "" },
        { json: "phone_number", js: "phone_number", typ: "" },
        { json: "zip_code", js: "zip_code", typ: "" },
        { json: "house_number", js: "house_number", typ: "" },
        { json: "street", js: "street", typ: "" },
        { json: "city", js: "city", typ: "" },
        { json: "country", js: "country", typ: "" },
        { json: "iban", js: "iban", typ: null },
    ], false),
    "PagePDP": o([
        { json: "full_description", js: "full_description", typ: "" },
        { json: "cancel_conditions", js: "cancel_conditions", typ: "" },
        { json: "payment_conditions", js: "payment_conditions", typ: "" },
        { json: "check_in_out_info", js: "check_in_out_info", typ: "" },
        { json: "between", js: "between", typ: "" },
        { json: "uur_en", js: "uur_en", typ: "" },
        { json: "hour", js: "hour", typ: "" },
        { json: "check_in", js: "check_in", typ: "" },
        { json: "check_out", js: "check_out", typ: "" },
        { json: "before", js: "before", typ: "" },
        { json: "house_rules", js: "house_rules", typ: "" },
        { json: "when", js: "when", typ: "" },
        { json: "how_many", js: "how_many", typ: "" },
        { json: "select_dates", js: "select_dates", typ: "" },
        { json: "checkin_checkout", js: "checkin_checkout", typ: "" },
        { json: "guests", js: "guests", typ: "" },
        { json: "tc_admin_label", js: "tc_admin_label", typ: "" },
        { json: "tc_admin_body", js: "tc_admin_body", typ: "" },
        { json: "tc_admin_link_label", js: "tc_admin_link_label", typ: "" },
    ], false),
    "PageSPA": o([
        { json: "map", js: "map", typ: "" },
        { json: "list", js: "list", typ: "" },
        { json: "accos_found", js: "accos_found", typ: "" },
        { json: "filterOptions", js: "filterOptions", typ: a(r("Country")) },
    ], false),
    "Stripe": o([
        { json: "pay", js: "pay", typ: "" },
        { json: "close_stripe", js: "close_stripe", typ: "" },
    ], false),
    "SubFilter": o([
        { json: "more", js: "more", typ: "" },
        { json: "less", js: "less", typ: "" },
        { json: "find_the_perfect_spot", js: "find_the_perfect_spot", typ: "" },
        { json: "reset_filters", js: "reset_filters", typ: "" },
        { json: "your_filters", js: "your_filters", typ: "" },
        { json: "show_results", js: "show_results", typ: "" },
    ], false),
};
