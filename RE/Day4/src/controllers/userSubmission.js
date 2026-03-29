const Problem = require("../models/problem");
const Submission = require("../models/submission");
const User = require("../models/user");
const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");


// ======================= SUBMIT CODE (Hidden Test Cases) =======================

const submitCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;

    let { code, language } = req.body;

    if (!userId || !problemId || !code || !language)
      return res.status(400).send("Some field missing");

    // 🔹 Normalize language inputs
    if (language === "js") language = "javascript";
    if (language === "py") language = "python";

    // 🔹 Allow only javascript & python
    if (!["javascript", "python"].includes(language))
      return res.status(400).send("Language not supported");

    const problem = await Problem.findById(problemId);

    // 🔹 Create initial pending submission
    const submittedResult = await Submission.create({
      userId,
      problemId,
      code,
      language,
      status: "pending",
      testCasesTotal: problem.hiddenTestCases.length
    });

    const languageId = getLanguageById(language);

    // 🔹 Prepare hidden testcases for Judge0
    const submissions = problem.hiddenTestCases.map(tc => ({
      source_code: code,
      language_id: languageId,
      stdin: tc.input,
      expected_output: tc.output
    }));

    const submitResult = await submitBatch(submissions);
    const tokens = submitResult.map(v => v.token);
    const testResult = await submitToken(tokens);

    // 🔹 Evaluate results
    let testCasesPassed = 0,
        runtime = 0,
        memory = 0,
        status = "accepted",
        errorMessage = null;

    for (const t of testResult) {
      if (t.status_id === 3) {
        testCasesPassed++;
        runtime += parseFloat(t.time);
        memory = Math.max(memory, t.memory);
      } else {
        status = (t.status_id === 4) ? "error" : "wrong";
        errorMessage = t.stderr;
      }
    }

    // 🔹 Update submission record
    submittedResult.status = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;
    await submittedResult.save();

    // 🔹 Only add to solved list if ACCEPTED
    if (status === "accepted") {
      if (!req.result.problemSolved.includes(problemId)) {
        req.result.problemSolved.push(problemId);
        await req.result.save();
      }
    }

    return res.status(201).json({
      accepted: status === "accepted",
      totalTestCases: submittedResult.testCasesTotal,
      passedTestCases: testCasesPassed,
      runtime,
      memory
    });

  } catch (err) {
    res.status(500).send("Internal Server Error " + err);
  }
};



// ======================= RUN CODE (Visible Test Cases Only) =======================

const runCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;

    let { code, language } = req.body;

    if (!userId || !problemId || !code || !language)
      return res.status(400).send("Some field missing");

    // 🔹 Normalize
    if (language === "js") language = "javascript";
    if (language === "py") language = "python";

    // 🔹 Validate
    if (!["javascript", "python"].includes(language))
      return res.status(400).send("Language not supported");

    const problem = await Problem.findById(problemId);
    const languageId = getLanguageById(language);

    // 🔹 Run only on visible testcases
    const submissions = problem.visibleTestCases.map(tc => ({
      source_code: code,
      language_id: languageId,
      stdin: tc.input,
      expected_output: tc.output
    }));

    const submitResult = await submitBatch(submissions);
    const tokens = submitResult.map(v => v.token);
    const testResult = await submitToken(tokens);

    // 🔹 Compute run summary
    let testCasesPassed = 0,
        runtime = 0,
        memory = 0,
        success = true;

    for (const t of testResult) {
      if (t.status_id === 3) {
        testCasesPassed++;
        runtime += parseFloat(t.time);
        memory = Math.max(memory, t.memory);
      } else {
        success = false;
      }
    }

    return res.status(201).json({
      success,
      totalTestCases: problem.visibleTestCases.length,
      passedTestCases: testCasesPassed,
      runtime,
      memory,
      testResults: testResult
    });

  } catch (err) {
    res.status(500).send("Internal Server Error " + err);
  }
};


module.exports = { submitCode, runCode };
