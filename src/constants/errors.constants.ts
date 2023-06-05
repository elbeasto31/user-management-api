const AUTH_ERRORS = {
    WrongCreds: 'You need to provide valid auth credentials',
    NoSuchUser: 'User with the given credentials was not registered',
    UserAlreadyExists: 'User with the given credentials was already registered',
    NoSuchBoss: 'No boss found with the provided name',
}

const USERS_ERRORS = {
    WrongBoss: 'You are not this user\'s boss',
    NewBossNotFound: 'Could not found a boss with the provided name',
}

export { AUTH_ERRORS, USERS_ERRORS };