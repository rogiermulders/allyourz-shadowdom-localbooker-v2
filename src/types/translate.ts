export interface Root {
    localbooker: Localbooker
    firstDayOfWeek: number
    dayNames: string[]
    dayNamesShort: string[]
    dayNamesMin: string[]
    monthNames: string[]
    monthNamesShort: string[]
}

export interface Localbooker {
    labels: Labels
    reviews: Reviews
    countries: Country[]
    mainFilter: MainFilter
    subFilter: SubFilter
    cart: Cart
    stripe: Stripe
    page_pdp: PagePdp
    page_spa: PageSpa
    page_thankyou: PageThankyou
    page_confirm: PageConfirm
    page_form: PageForm
}

export interface Labels {
    search_and_book: string
    choose: string
    none: string
    go_to: string
    go_back: string
    more_info: string
    select_dates: string
    show_pricing: string
    go_book: string
    not_available: string
    choose_your_room: string
    from_night: string
    guest: string
    guests: string
    adults: string
    adult: string
    children: string
    child: string
    babys: string
    baby: string
    pet: string
    pets: string
    bedroom: string
}

export interface Reviews {
    label_1: string
    label_6: string
    label_7: string
    label_8: string
    label_9: string
    i_google: string
}

export interface Country {
    label: string
    value: string
}

export interface MainFilter {
    where: string
    when: string
    type: string
    who: string
    "Heel Zeeland": string
    selectdate: string
    selecttype: string
    selectguest: string
    regions: string
    destinations: string
    choose_checkin: string
    choose_checkout: string
}

export interface SubFilter {
    more: string
    less: string
    find_the_perfect_spot: string
    reset_filters: string
    your_filters: string
    show_results: string
}

export interface Cart {
    night: string
    total: string
    subtotal: string
    pay_now: string
    pay_later: string
}

export interface Stripe {
    pay: string
    close_stripe: string
}

export interface PagePdp {
    usp_0: string
    usp_1: string
    usp_2: string
    usp_3: string
    usp_4: string
    cancelation_rules: string
    free_cancelation: string
    cancellation_threshold_hours: string
    cancellation_threshold_days: string
    cancellation_default_text_STAYS: string
    pay_in_advance_situation_percentage: string
    pay_in_advance_situation_email: string
    pay_in_advance_situation_arrival: string
    pay_in_advance_situation_default_text: string
    pdp_no_deposit: string
    full_description: string
    cancel_conditions: string
    payment_conditions: string
    check_in_out_info: string
    between: string
    uur_en: string
    hour: string
    check_in: string
    check_out: string
    before: string
    house_rules: string
    when: string
    how_many: string
    select_dates: string
    checkin_checkout: string
    guests: string
    tc_admin_label: string
    tc_admin_body: string
    tc_admin_link_label: string
    need_help: string
    help_txt_1: string
    help_txt_2: string
    send_mail: string
}

export interface PageSpa {
    map: string
    list: string
    accos_found: string
    filterOptions: FilterOption[]
    nothing_found_1: string
    nothing_found_2: string
    nothing_found_3: string
    nothing_found_4: string
}

export interface FilterOption {
    value: string
    label: string
}

export interface PageThankyou {
    you_go: string
    thank_you: string
    receive_mail: string
    start_fun: string
    contact: string
    need_help: string
}

export interface PageConfirm {
    almost_ready: string
    check_booking: string
    booked_by: string
    more_details: string
    pay: string
    confirm: string
    terms_and_conditions_1: string
    terms_and_conditions_2: string
    terms_and_conditions_pdf: string
    error_header: string
    error_message: string
}

export interface PageForm {
    labels: Labels2
    naw: Naw
    placeholder: Placeholder
    label: Label
}

export interface Labels2 {
    almost_ready: string
    travel_company: string
    occupancy: string
    max_occupancy: string
    fill_the_form: string
    extra_info_1: string
    extra_info_2: string
    privacy_1: string
    privacy_2: string
    privacy_path: string
    add_ons: string
    not_available_header: string
    not_available_body: string
    not_available_other_date: string
    not_available_other_stay: string
}

export interface Naw {
    first_name: string
    last_name: string
    email: string
    phone_number: string
    zip_code: string
    house_number: string
    street: string
    city: string
    country: string
    iban: any
}

export interface Placeholder {
    first_name: string
    last_name: string
    email: string
    phone_number: string
    zip_code: string
    house_number: string
    street: string
    city: string
    country: string
    iban: any
}

export interface Label {
    optional: string
    is_mandatory: string
    is_wrong: string
    next_step: string
}
