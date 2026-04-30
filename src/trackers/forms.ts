import { enqueue } from '../core/buffer'
import { getSessionId } from '../core/session'
import { registerCleanup } from '../core/cleanup'

export function initFormTracker(websiteId: string, apiUrl: string) {
    const focusoutHandler = (event: Event) => {
        const target = event.target as HTMLInputElement
        if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
        if (target.type === 'password') return

        const form = target.closest('form')
        const sessionId = getSessionId()

        enqueue(apiUrl, {
            website_id: websiteId,
            session_id: sessionId,
            event_name: 'form_focus',
            url_path: window.location.pathname,
            event_data: {
                form_id: form?.id || null,
                field: target.getAttribute('name') || null,
                has_value: target.value.length > 0
            }
        })
    }

    const submitHandler = (event: Event) => {
        const form = event.target as HTMLFormElement
        const sessionId = getSessionId()

        enqueue(apiUrl, {
            website_id: websiteId,
            session_id: sessionId,
            event_name: 'form_submit',
            url_path: window.location.pathname,
            event_data: {
                form_id: form?.id || null
            }
        })
    }

    document.addEventListener('focusout', focusoutHandler)
    document.addEventListener('submit', submitHandler)

    registerCleanup(() => {
        document.removeEventListener('focusout', focusoutHandler)
        document.removeEventListener('submit', submitHandler)
    })
}