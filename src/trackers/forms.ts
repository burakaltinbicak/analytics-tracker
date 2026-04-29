import { send } from '../core/send'
import { getSessionId } from '../core/session'

export function initFormTracker(websiteId: string, apiUrl: string) {
    document.addEventListener('focusout', (event) => {
        const target = event.target as HTMLInputElement
        if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
        if ((target as HTMLInputElement).type === 'password') return

        const form = target.closest('form')
        const sessionId = getSessionId()

        send(apiUrl, {
            website_id: websiteId,
            session_id: sessionId,
            event_name: 'form_focus',
            url_path: window.location.pathname,
            event_data: {
                form_id: form?.id || null,
                field: target.getAttribute('name') || null,
                value: target.value

            }
        })
    })

    document.addEventListener('submit', (event) => {
        const form = event.target as HTMLFormElement
        const sessionId = getSessionId()

        send(apiUrl, {
            website_id: websiteId,
            session_id: sessionId,
            event_name: 'form_submit',
            url_path: window.location.pathname,
            event_data: {
                form_id: form?.id || null
            }
        })
    })
}