"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Complete, { type CompletionResult } from "@/fetch_wrapper/autocomplete";
import FindPath from "@/fetch_wrapper/findpath";
import { AutoComplete } from "@/components/autocomplete";
import { UnauthorizedError } from "@/fetch_wrapper/error";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { ExplanationModal } from "@/components/explanation-modal";
import WikigraphExplanation from "@/components/wikigraph-explanation";

export default function Home() {
  // From input state
  const [fromSearchValue, setFromSearchValue] = useState<string>("");
  const [fromSelectedValue, setFromSelectedValue] = useState<string>("");
  const [fromItems, setFromItems] = useState<
    { value: string; label: string }[]
  >([]);
  const [fromLoading, setFromLoading] = useState<boolean>(false);
  const [fromSelectedItem, setFromSelectedItem] =
    useState<CompletionResult | null>(null);

  // To input state
  const [toSearchValue, setToSearchValue] = useState<string>("");
  const [toSelectedValue, setToSelectedValue] = useState<string>("");
  const [toItems, setToItems] = useState<{ value: string; label: string }[]>(
    [],
  );
  const [toLoading, setToLoading] = useState<boolean>(false);
  const [toSelectedItem, setToSelectedItem] = useState<CompletionResult | null>(
    null,
  );

  // Password state
  const [password, setPassword] = useState<string>("");

  // Path result state
  const [pathResult, setPathResult] = useState<string[]>([]);

  // Loading state for search operation
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Add these state variables after the other state declarations
  const [authError, setAuthError] = useState<string | null>(null);
  const [fromError, setFromError] = useState<string | null>(null);
  const [toError, setToError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Fetch suggestions for "From" input
  useEffect(() => {
    const fetchFromSuggestions = async () => {
      if (fromSearchValue.length < 2) {
        setFromItems([]);
        return;
      }

      setFromLoading(true);
      try {
        setAuthError(null);
        setFromError(null);
        const results = await Complete(fromSearchValue, password);
        const formattedItems = results.map((item) => ({
          value: item.Offset.toString(),
          label: item.Title,
        }));
        setFromItems(formattedItems);

        // Store the original results for later reference
        const selectedResult = results.find(
          (item) => item.Offset.toString() === fromSelectedValue,
        );
        if (selectedResult) {
          setFromSelectedItem(selectedResult);
        }
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          setAuthError(error.message);
        } else {
          console.error("Error fetching from suggestions:", error);
          setFromError("Failed to fetch suggestions. Please try again.");
        }
        setFromItems([]);
      } finally {
        setFromLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchFromSuggestions, 700);
    return () => clearTimeout(timeoutId);
  }, [fromSearchValue, fromSelectedValue, password]);

  // Fetch suggestions for "To" input
  useEffect(() => {
    const fetchToSuggestions = async () => {
      if (toSearchValue.length < 2) {
        setToItems([]);
        return;
      }

      setToLoading(true);
      try {
        setAuthError(null);
        setToError(null);
        const results = await Complete(toSearchValue, password);
        const formattedItems = results.map((item) => ({
          value: item.Offset.toString(),
          label: item.Title,
        }));
        setToItems(formattedItems);

        // Store the original results for later reference
        const selectedResult = results.find(
          (item) => item.Offset.toString() === toSelectedValue,
        );
        if (selectedResult) {
          setToSelectedItem(selectedResult);
        }
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          setAuthError(error.message);
        } else {
          console.error("Error fetching to suggestions:", error);
          setToError("Failed to fetch suggestions. Please try again.");
        }
        setToItems([]);
      } finally {
        setToLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchToSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [toSearchValue, toSelectedValue, password]);

  // Handle search button click
  const handleSearch = async () => {
    if (!fromSelectedItem || !toSelectedItem) {
      console.error("Please select valid items from the suggestions");
      return;
    }

    // Set searching state to true to show the spinner
    setIsSearching(true);

    try {
      setAuthError(null);
      setSearchError(null);
      const result = await FindPath(
        fromSelectedItem.Offset,
        toSelectedItem.Offset,
        password,
      );
      setPathResult(result);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        setAuthError(error.message);
      } else {
        console.error("Error finding path:", error);
        setSearchError("Failed to find path. Please try again.");
      }
    } finally {
      // Set searching state to false to hide the spinner
      setIsSearching(false);
    }
  };

  // Update the selectedItem when a value is selected
  useEffect(() => {
    const updateFromSelectedItem = async () => {
      if (fromSelectedValue) {
        try {
          setAuthError(null);
          const results = await Complete(fromSearchValue, password);
          const selected = results.find(
            (item) => item.Offset.toString() === fromSelectedValue,
          );
          if (selected) {
            setFromSelectedItem(selected);
          }
        } catch (error) {
          if (error instanceof UnauthorizedError) {
            setAuthError(error.message);
          } else {
            console.error("Error finding selected 'from' item:", error);
          }
        }
      } else {
        setFromSelectedItem(null);
      }
    };

    updateFromSelectedItem();
  }, [fromSelectedValue, fromSearchValue, password]);

  useEffect(() => {
    const updateToSelectedItem = async () => {
      if (toSelectedValue) {
        try {
          setAuthError(null);
          const results = await Complete(toSearchValue, password);
          const selected = results.find(
            (item) => item.Offset.toString() === toSelectedValue,
          );
          if (selected) {
            setToSelectedItem(selected);
          }
        } catch (error) {
          if (error instanceof UnauthorizedError) {
            setAuthError(error.message);
          } else {
            console.error("Error finding selected 'to' item:", error);
          }
        }
      } else {
        setToSelectedItem(null);
      }
    };

    updateToSelectedItem();
  }, [toSelectedValue, toSearchValue, password]);

  return (
    <main className="min-h-screen flex flex-col items-center p-4">
      <div className="w-full max-w-md flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-8">Wikigraph</h1>
        <div className="flex flex-row space-x-4">
          <Button variant="link">
            <a href="https://github.com/notzree/wikigraph_server">@github</a>
          </Button>

          <WikigraphExplanation />
        </div>
        {authError && (
          <Alert variant="destructive" className="mb-4 w-full">
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}

        <div className="w-full space-y-4 mb-6">
          <div className="w-full">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full"
            />
          </div>

          <div className="w-full">
            <label htmlFor="from" className="block text-sm font-medium mb-1">
              From
            </label>
            <AutoComplete
              selectedValue={fromSelectedValue}
              onSelectedValueChange={setFromSelectedValue}
              searchValue={fromSearchValue}
              onSearchValueChange={setFromSearchValue}
              items={fromItems}
              isLoading={fromLoading}
              emptyMessage="No articles found."
              placeholder="From..."
            />
            {fromError && !authError && (
              <p className="text-sm text-red-500 mt-1">{fromError}</p>
            )}
          </div>

          <div className="w-full">
            <label htmlFor="to" className="block text-sm font-medium mb-1">
              To
            </label>
            <AutoComplete
              selectedValue={toSelectedValue}
              onSelectedValueChange={setToSelectedValue}
              searchValue={toSearchValue}
              onSearchValueChange={setToSearchValue}
              items={toItems}
              isLoading={toLoading}
              emptyMessage="No articles found."
              placeholder="To..."
            />
            {toError && !authError && (
              <p className="text-sm text-red-500 mt-1">{toError}</p>
            )}
          </div>

          <Button
            onClick={handleSearch}
            disabled={!fromSelectedItem || !toSelectedItem || isSearching}
            className="w-full"
          >
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              "Search"
            )}
          </Button>
          {searchError && !authError && (
            <p className="text-sm text-red-500 mt-2">{searchError}</p>
          )}
        </div>
      </div>

      {isSearching && (
        <div className="mt-8 flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">
            Finding path between articles...
          </p>
        </div>
      )}

      {!isSearching && pathResult.length > 0 && (
        <div className="w-full max-w-md mt-8 p-4 border rounded-lg shadow-sm">
          <h2 className="font-bold mb-4 text-center">Path Result:</h2>
          <ul className="flex flex-col items-center">
            {pathResult.map((step, i) => (
              <li
                key={i}
                className="flex flex-col items-center text-center mb-2"
              >
                <a
                  href={`https://en.wikipedia.org/wiki/${encodeURIComponent(step).replace(/%20/g, "_")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {step}
                </a>
                {i < pathResult.length - 1 && <span className="my-1">↓</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
