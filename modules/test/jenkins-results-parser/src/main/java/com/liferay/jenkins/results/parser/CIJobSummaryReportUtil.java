/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

package com.liferay.jenkins.results.parser;

import java.io.File;
import java.io.IOException;

/**
 * @author Michael Hashimoto
 */
public class CIJobSummaryReportUtil {

	public static void writeJobSummaryReport(File summaryDir, Job job)
		throws IOException {

		if (!summaryDir.exists()) {
			summaryDir.mkdirs();
		}

		JenkinsResultsParserUtil.write(
			new File(summaryDir, "js/job-data.js"),
			"data=" + job.getJSONObject());

		String indexHTMLContent =
			JenkinsResultsParserUtil.getResourceFileContent(
				"dependencies/job/summary/index.html");

		indexHTMLContent = indexHTMLContent.replace(
			"href=\"css/main.css\"",
			JenkinsResultsParserUtil.combine(
				"href=\"", _JOB_SUMMARY_RESOURCE_URL, "/css/main.css\""));
		indexHTMLContent = indexHTMLContent.replace(
			"src=\"js/main.js\"",
			JenkinsResultsParserUtil.combine(
				"src=\"", _JOB_SUMMARY_RESOURCE_URL, "/js/main.js\""));

		JenkinsResultsParserUtil.write(
			new File(summaryDir, "index.html"), indexHTMLContent);
	}

	private static final String _JOB_SUMMARY_RESOURCE_URL =
		JenkinsResultsParserUtil.combine(
			"https://cdn.jsdelivr.net/gh/liferay/liferay-portal@",
			"2d820727967128fdd91bd7e3a54bdad6507c738f",
			"/modules/test/jenkins-results-parser/src/main/resources/com",
			"/liferay/jenkins/results/parser/dependencies/job/summary");

}