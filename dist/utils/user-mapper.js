export function toDto(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
    };
}
export function getUniqIdValue() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
//# sourceMappingURL=user-mapper.js.map