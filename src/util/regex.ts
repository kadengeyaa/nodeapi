export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const PHONE_NUMBER_REGEX = /^0[\d]{5,12}$/;

export const PASSWORD_REGEX = /^[^\s]{4,16}$/;

export const NAME_REGEX = /^([a-zA-Z-'.]{1,16}\s{0,3}){1,4}$/;

export const USERNAME_REGEX = /^[\w]{2,32}$/;
