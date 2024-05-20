export default function getErrorMessageFromData(data) {
    let message = ''

    for (const [key, value] of Object.entries(data)) {
        if (key === 'message') {
            message += `${value}\n`
        } else {
            message += `${key}: ${value}\n`
        }
    }
    return message
}