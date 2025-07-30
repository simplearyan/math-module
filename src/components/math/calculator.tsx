"use client";

import React, { useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EyeIcon, EyeOffIcon, Terminal } from "lucide-react";
import { evaluate } from "mathjs";

// Simple input parser (could enhance with a math field for more power)
const DEFAULT_BUTTONS = [
  {
    tab: "basic",
    keys: [
      "7",
      "8",
      "9",
      "/",
      "4",
      "5",
      "6",
      "*",
      "1",
      "2",
      "3",
      "-",
      "0",
      ".",
      "+",
    ],
  },
  {
    tab: "algebra",
    keys: ["x", "y", "z", "(", ")", "^", "sqrt(", "abs(", "log(", "ln("],
  },
  {
    tab: "trigonometry",
    keys: ["sin(", "cos(", "tan(", "asin(", "acos(", "atan(", "pi", "e"],
  },
  { tab: "calculus", keys: ["diff(", "int(", "lim(", "exp(", "infinity"] },
];

type TabName = "basic" | "algebra" | "trigonometry" | "calculus";


function getButtonSet(tab: TabName) {
  return DEFAULT_BUTTONS.find((obj) => obj.tab === tab)?.keys || [];
}

const tabLabels: { label: string, value: TabName }[] = [
  { label: "Basic", value: "basic" },
  { label: "Algebra", value: "algebra" },
  { label: "Trigonometry", value: "trigonometry" },
  { label: "Calculus", value: "calculus" }
];


const MathSolverCalculator = () => {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [showCalculator, setShowCalculator] = useState(true);

  function handleButtonClick(val: string) {
    setExpression((prev) => prev + val);
    setError(null);
    setShowAlert(false);
  }

  function handleClear() {
    setExpression("");
    setResult("");
    setError(null);
    setShowAlert(false);
  }

  function handleBackspace() {
    setExpression((prev) => prev.slice(0, -1));
    setError(null);
    setShowAlert(false);
  }

  function handleEvaluate() {
    try {
      // "exp(" → "exp(" is valid in mathjs, likewise log, sqrt, etc
      let res = evaluate(expression).toString();
      setResult(res);
      setError(null);
      setShowAlert(true);
    } catch (e: unknown) {
        
      setResult("");
    //   setError(e.message);
      setShowAlert(true);
    }
  }

  return (
    <div className="flex min-h-screen py-10 items-center justify-center bg-gradient-to-br from-blue-50/70 via-white to-indigo-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-800 transition-colors">
      <Card className="w-full max-w-xl rounded-2xl shadow-2xl bg-white/90 dark:bg-zinc-900/90 border-0">
        <CardHeader className="p-8 pb-4">
          <CardTitle className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-indigo-700 via-blue-500 to-indigo-800 text-transparent bg-clip-text dark:from-blue-300 dark:via-indigo-300 dark:to-blue-500">
            Math Solver
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-5">
          {/* Math Input */}
          <div>
            <label htmlFor="mathinput" className="sr-only">
              Enter math problem
            </label>
            <div className="relative">
              <input
                id="mathinput"
                autoComplete="off"
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 px-4 py-3 text-lg font-mono font-semibold shadow-inner focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-zinc-100 dark:placeholder-zinc-400 transition-colors min-h-[48px] outline-none"
                placeholder="Enter any math equation…"
                value={expression}
                onChange={(e) => {
                  setExpression(e.target.value);
                  setError(null);
                  setShowAlert(false);
                }}
              />
              <kbd className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-400 dark:text-zinc-600">
                ⌨️
              </kbd>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={
                  showCalculator ? "Hide calculator" : "Show calculator"
                }
                onClick={() => setShowCalculator((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                {showCalculator ? (
                  <EyeOffIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </Button>
            </div>
            {showAlert && (
              <Alert
                variant={error ? "destructive" : "default"}
                className="mt-4"
              >
                <Terminal className="h-5 w-5 mr-2 inline-block" />
                <AlertTitle className="font-bold">
                  {error ? "Calculation Error" : "Calculation Successful!"}
                </AlertTitle>
                <AlertDescription>
                  {error ? `Could not evaluate: ${error}` : `Result: ${result}`}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {showCalculator && (
            <div>
              {/* Tabs */}
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-zinc-100/70 dark:bg-zinc-900/50 rounded-xl border-0 mb-2 shadow-sm">
                  {tabLabels.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="h-8 text-xs font-semibold"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {tabLabels.map((tab) => (
                  <TabsContent
                    key={tab.value}
                    value={tab.value}
                    className="mt-2"
                  >
                    <div className="grid grid-cols-4 gap-3">
                      {getButtonSet(tab.value).map((key) => (
                        <Button
                          key={key}
                          onClick={() => handleButtonClick(key)}
                          variant="outline"
                          className="text-lg font-semibold bg-zinc-50 hover:bg-indigo-100 dark:bg-zinc-950 dark:hover:bg-indigo-900 transition"
                        >
                          {key
                            .replace("sqrt(", "√")
                            .replace("abs(", "|x|")
                            .replace("log(", "log")
                            .replace("ln(", "ln")}
                        </Button>
                      ))}
                      <Button
                        onClick={handleClear}
                        variant="destructive"
                        className="col-span-2 text-lg font-semibold"
                      >
                        CLR
                      </Button>
                      <Button
                        onClick={handleBackspace}
                        variant="outline"
                        className="col-span-2 text-lg font-semibold"
                      >
                        ←
                      </Button>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
              {/* Calculate Button */}
              <div className="grid grid-cols-1 gap-2 mt-4">
                <Button
                  onClick={handleEvaluate}
                  className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800 text-white font-semibold text-xl py-4 rounded-xl shadow-lg shadow-indigo-300/15 dark:text-zinc-100 hover:from-indigo-700 hover:to-blue-700 transition-all"
                  size="lg"
                >
                  Calculate
                </Button>
              </div>
            </div>
          )}

          {/* If not using alert, just show result below */}
          {result && !error && !showAlert && (
            <div className="text-center mt-3 p-3 bg-zinc-100/80 dark:bg-zinc-900/50 rounded-xl text-xl font-medium">
              <span className="text-indigo-600 dark:text-blue-300">
                Result:
              </span>{" "}
              {result}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MathSolverCalculator;
