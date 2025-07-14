# Vercel Logs Guide

This guide explains how to access and view Vercel logs using the CLI.

## Types of Logs

Vercel provides two types of logs:
1. **Build Logs** - Generated during the deployment build process
2. **Runtime Logs** - Generated when your application runs (from Middleware and Vercel Functions)

## Viewing Build Logs

To view build logs for a specific deployment:

```bash
vercel inspect <deployment-url> --logs
# or shorthand
vercel inspect <deployment-url> -l
```

Example:
```bash
vercel inspect https://personal-jesus-reference-rdqiwaznw.vercel.app --logs
```

### Build Log Options
- `--wait` - For in-progress builds, shows logs in real-time
- `--timeout` - Sets wait time for deployment completion (default: 3 minutes)

## Viewing Runtime Logs

To view runtime logs (includes function execution logs):

```bash
vercel logs <deployment-url>
```

### Important Notes about Runtime Logs
- **Storage Limit**: Runtime logs are only stored for a maximum of 1 hour
- **Default Behavior**: The command now follows logs by default (shows new logs as they come in)
- **Time Range**: Shows logs for up to 5 minutes from when the command is run

### Runtime Log Options
- `--json` or `-j` - Outputs logs in JSON format for processing

Example with JSON filtering:
```bash
vercel logs <deployment-url> --json | jq 'select(.level == "error")'
```

## Quick Reference

| Task | Command |
|------|---------|
| View build logs | `vercel inspect <url> --logs` |
| View runtime logs (following) | `vercel logs <url>` |
| View runtime logs as JSON | `vercel logs <url> --json` |
| View build logs for in-progress deployment | `vercel inspect <url> --logs --wait` |

## Limitations

1. Runtime logs are only retained for 1 hour
2. No direct way to view historical runtime logs without following
3. For more detailed logs and longer retention, use the Vercel Dashboard

## Alternative: Vercel Dashboard

For comprehensive log viewing:
1. Go to your project in the Vercel Dashboard
2. Click on the deployment
3. Navigate to the "Logs" tab for runtime logs
4. Or click "View Build Logs" for build logs

## Persistent Log Storage with Log Drains

Since runtime logs are only retained for 1 hour, use Log Drains for persistent storage:

### Requirements
- **Pro or Enterprise plan** (Hobby users can only use existing log drains created before May 23, 2024)
- Third-party logging service (e.g., Datadog, LogDNA, Logflare, Better Stack, etc.)

### Setup Steps
1. Go to your Vercel Team Settings
2. Navigate to "Log Drains"
3. Click "Add Log Drain"
4. Configure:
   - **Sources**: Select "Function" and "Edge" for runtime logs
   - **Delivery Format**: Choose JSON or NDJSON
   - **Sampling Rate**: Start with 100% (can adjust for high-traffic apps)
   - **Endpoint URL**: Your logging service's ingestion endpoint
   - **Custom Headers**: Authentication tokens if required
5. Connect to specific projects

### Benefits
- Permanent log storage
- Search and filter capabilities
- Alerting on error patterns
- Metrics and analytics
- Debugging production issues

### Cost
- $0.50 per 1 GB of log data on Vercel
- Plus costs from your chosen logging provider

### Popular Log Drain Providers
- Datadog
- LogDNA (now Mezmo)
- Logflare
- Better Stack
- Sumo Logic
- Custom HTTP/HTTPS endpoints

## Troubleshooting

If logs aren't appearing:
1. Ensure your application is generating logs using `console.log()` or logging frameworks
2. Make sure there's traffic to your application (runtime logs only appear when functions execute)
3. Check that you're using the correct deployment URL
4. For Hobby plans, some logging features may be limited
5. Verify log drain configuration if using external services