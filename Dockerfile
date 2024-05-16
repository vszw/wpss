FROM oven/bun:1 as base
WORKDIR /app

# install chrome for puppeteer that support non-latin characters
RUN apt-get -y update && apt-get install -y wget gnupg
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | tee /etc/apt/trusted.gpg.d/google.asc >/dev/null
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' 
RUN apt-get -y update
RUN apt-get install -y google-chrome-stable

# install all fonts
RUN apt-get install -y fonts-* --no-install-recommends
RUN rm -rf /var/lib/apt/lists/*

# install bun packages
COPY . .
RUN bun install --frozen-lockfile

# run
USER bun
EXPOSE 50690
CMD ["bun", "run", "index.ts"]