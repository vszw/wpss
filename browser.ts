import playwright from 'playwright'

class BrowserWrapper {
    Browser!: playwright.Browser
    UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

    async init() {
        this.Browser = await playwright.chromium.launch({
            channel: 'chrome',
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--font-render-hinting=none',
                '--enable-font-antialiasing',
                '--force-color-profile=srgb',
            ]
        })

        console.log('wpss: browser initialized')
    }

    async close() {
        await this.Browser.close()
    }

    async np(url: string | URL) {
        const page = await this.Browser.newPage({
            userAgent: this.UA,
            viewport: {
                width: 1366,
                height: 679
            },
            ignoreHTTPSErrors: true
        })

        await page.goto(url.toString(), {
            timeout: 30_000
        })

        return page
    }

    async ss(url: string | URL, selector: string, transparent: boolean = false) {
        const page = await this.np(url)

        const element = await page.$(selector)
        if ( !element ) {
            throw new Error(`Element not found: ${selector}`)
        }

        const screenshot = await element.screenshot({
            type: 'png',
            animations: 'disabled',
            omitBackground: transparent,
        })

        await page.close()
        return screenshot
    }
}

export default BrowserWrapper