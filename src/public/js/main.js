window.addEventListener('load', () => {
    const appLang = document.querySelector('[data-lang]').getAttribute('data-lang')
    const form = document.querySelector('#register_form')
    const submit = document.querySelector('#submit')
    const request = new XMLHttpRequest()

    let submitting = false

    request.addEventListener("load", () => {
        try {
            const response = JSON.parse(request.response)
            Swal.fire(
                '',
                response.message,
                request.status === 200 ? 'success' : 'warning'
            )
        } catch (e) {
        }
    })

    request.addEventListener("error", handleError)
    request.addEventListener("loadend", () => { submitting = false; submit.removeAttribute('disabled') })

    form.addEventListener('submit', e => {
        e.preventDefault()

        if (submitting) { return }

        if (!isAccountTypeSelected() || !isEmailvalid()) {
            return
        }

        const payload = {}

        for (const pair of new FormData(form).entries()) {
            payload[pair[0]] = pair[1]
        }

        request.open('POST', `/?lang=${appLang}`)
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
        request.send(JSON.stringify(payload))
        submitting = true
        submit.setAttribute('disabled', true)
    })
})

function handleError() {
    Swal.fire(
        'ERROR',
        'Please try later',
        'error'
    )
}

function isAccountTypeSelected() {
    const radios = document.getElementsByName('account_type')

    for (const r of radios) {
        if (r.checked) {
            return true
        }
    }
}

function isEmailvalid() {
    const email = document.querySelector('#email')
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

    return emailRegex.test(email.value)
}