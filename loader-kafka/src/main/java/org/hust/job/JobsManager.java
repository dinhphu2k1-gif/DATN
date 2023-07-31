package org.hust.job;

import com.beust.jcommander.JCommander;

public class JobsManager {
    private JobsManager() {

    }

    public static void main(String[] args) {
        ArgsOptional optional = new ArgsOptional();
        JCommander.newBuilder()
                .addObject(optional)
                .build()
                .parse(args);

        if (!optional.isValid()) {
            return;
        }

        IJobBuilder jobBuilder = null;
        switch (optional.getJobName()) {
            case "CollectEvent":
                jobBuilder = IJobBuilder.createJob(EnumJob.Collect);
                break;
            case "BatchEvent":
                jobBuilder = IJobBuilder.createJob(EnumJob.Batch);
                break;
            default:
                throw new IllegalStateException("Unexpected value: " + optional.getJobName());
        }

        try {
            jobBuilder.run(optional);
        } catch (Exception e) {
            e.printStackTrace();
            System.exit(1);
        }
    }
}
