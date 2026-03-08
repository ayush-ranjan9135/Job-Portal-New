  // Import with if you are using ES
import * as Sentry from "@sentry/node"
import {nodeProfilingIntegration} from "@sentry/profiling-node";

  Sentry.init({
    dsn: process.env.SENTRY_DSN,

    integrations:[
      nodeProfilingIntegration(),
      Sentry.mongooseIntegration(),
    ],
    //tracing
    // tracesSampleRate:1.0,

  });

  Sentry.profiler.startProfiler();

  Sentry.startSpan({
      name:"My First Transaction",
  }, () =>{

  });

  Sentry.profiler.stopProfiler();