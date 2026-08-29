FROM node:lts-slim as runtime
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Enable the pnpm version pinned in package.json and install locked dependencies.
RUN corepack enable && pnpm install --frozen-lockfile

# Copy the rest of your application files.
COPY . .

RUN pnpm build

# Set environment variables and expose the appropriate port.
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

# Define the command to run your application.
CMD node ./dist/server/entry.mjs
