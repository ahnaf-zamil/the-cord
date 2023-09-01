// This secret must be as same as the one set in the REST API's config

export default {
    JWT_SECRET: process.env.JWT_SECRET || "very_secret_SHUSH_DONT_TELL",
    JWT_EXPIRY_SECONDS: 300
}