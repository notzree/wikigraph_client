"use client";

import { useState } from "react";
import type { GetServerSideProps } from "next";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, ArrowRight, Calendar, User } from "lucide-react";
import GetLeaderboard, {
  type LeaderboardResponse,
} from "@/api_wrapper/leaderboard";
import Head from "next/head";

interface LeaderboardPageProps {
  leaderboardData: LeaderboardResponse | null;
  error: string | null;
}

export default function LeaderboardPage({
  leaderboardData,
  error,
}: LeaderboardPageProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  return (
    <>
      <Head>
        <title>Leaderboard | WikiGraph</title>
        <meta
          name="description"
          content="View the top paths in the WikiGraph leaderboard"
        />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Trophy className="h-8 w-8 text-yellow-500" />
              Leaderboard
            </CardTitle>
            <CardDescription>
              Top 100 paths sorted by length (shortest first) and date
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!loading && !error && leaderboardData && (
              <p className="text-sm text-muted-foreground mb-4">
                Showing top {leaderboardData.entries.length} of{" "}
                {leaderboardData.total} total entries
              </p>
            )}
          </CardContent>
        </Card>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800">{error}</div>
        ) : leaderboardData ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead className="hidden md:table-cell">User</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Length</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData.entries.map((entry, index) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                        <span className="font-medium truncate max-w-[150px] md:max-w-[200px]">
                          {entry.fromTitle}
                        </span>
                        <ArrowRight className="hidden md:block h-4 w-4 text-muted-foreground" />
                        <span className="md:hidden text-muted-foreground">
                          →
                        </span>
                        <span className="font-medium truncate max-w-[150px] md:max-w-[200px]">
                          {entry.toTitle}
                        </span>
                      </div>
                      <div className="md:hidden flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{entry.name || "Anonymous"}</span>
                        <span className="mx-1">•</span>
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(entry.date)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {entry.name || "Anonymous"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(entry.date)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={index < 3 ? "default" : "secondary"}>
                        {entry.length} steps
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8">No data available</div>
        )}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<
  LeaderboardPageProps
> = async () => {
  try {
    const leaderboardData = await GetLeaderboard();
    return {
      props: {
        leaderboardData,
        error: null,
      },
    };
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return {
      props: {
        leaderboardData: null,
        error: "Failed to load leaderboard data. Please try again later.",
      },
    };
  }
};
