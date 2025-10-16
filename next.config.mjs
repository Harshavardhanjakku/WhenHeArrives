export default /** @type {import('next').NextConfig} */ ({
	experimental: {
		serverActions: {
			bodySizeLimit: '1mb'
		}
	}
});
