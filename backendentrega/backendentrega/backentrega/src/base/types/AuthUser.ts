type Permiso = {
    read    ?: boolean;
    create  ?: boolean;
    edit    ?: boolean;
    remove  ?: boolean;
    send    ?: boolean;
    download?: boolean;
    approve ?: boolean;
    lock    ?: boolean;
};

export type AuthUser = {
    uid           : string;
    email        ?: string;
    user_id      ?: string;
    permisos     ?: Permiso;
    roles        ?: string;
    [key: string] : any;
};