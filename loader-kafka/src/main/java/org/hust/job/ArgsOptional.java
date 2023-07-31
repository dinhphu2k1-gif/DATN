package org.hust.job;

import com.beust.jcommander.Parameter;
import lombok.Getter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@ToString
public class ArgsOptional {
    @Parameter
    private List<String> parameters;

    @Parameter(names = {"--groupId"}, description = "The Group ID determines which consumers belong to which group")
    @Getter
    private String groupId;

    @Parameter(names = {"--topics"}, description = "Where consume data from kafka")
    @Getter
    private String topics;

    @Parameter(names = {"--job"}, description = "CLASS NAME", required = true)
    @Getter
    private String jobName;

    @Parameter(names = {"--duration"}, description = "Time per batch")
    @Getter
    private int duration;

    /**
     * Constructor initializes objects and assigns default values to variables
     */
    public ArgsOptional() {
        this.parameters = new ArrayList<>();
    }

    /**
     * Check the required parameters.
     * @return true is valid, false is invalid;
     */
    public boolean isValid() {
        if (jobName == null || jobName.length() == 0) {
            return false;
        }
        return true;
    }
}
