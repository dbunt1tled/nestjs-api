//import cluster from 'cluster';
import * as notReallyCluster from 'cluster';
import * as os from 'os';
import * as process from 'node:process';

export function runInCluster(bootstrap: () => Promise<void>) {
  const numCPUs = os.cpus().length;
  const cluster = notReallyCluster as unknown as notReallyCluster.Cluster;
  if (process.env.CLUSTERING === 'true' && cluster.isPrimary) {
    console.log(`🚀 Master server started on ${process.pid}`);
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
      console.log(`🚦Worker ${worker.process.pid} died. Restarting`);
      cluster.fork();
    });
  } else {
    bootstrap();
  }
}
