import { ExplanationModal } from "./explanation-modal";

export default function WikigraphExplanation() {
  return (
    <ExplanationModal triggerText="what is this?" title="what is this?">
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-medium">What is Wikigraph?</h3>
          <p className="mt-2">
            Wikigraph helps you find the shortest path between two Wikipedia
            articles. Think of it as a &quot;Six Degrees of Kevin Bacon&quot;
            but for Wikipedia - it shows you the smallest number of clicks
            needed to navigate from one article to another.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-medium">How It Works</h3>
          <p className="mt-2">
            Wikigraph treats Wikipedia as a massive network where each article
            is a node and each hyperlink is a connection. Using a breadth-first
            search algorithm, it finds the shortest possible path between any
            two articles.
          </p>
          <p className="mt-2">
            Behind the scenes, the system compresses Wikipedia&apos;s enormous
            link structure (originally ~100GB) into a compact 2GB format that
            can be searched efficiently.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-medium">password?</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mt-2">
            <ul className="list-disc pl-5 space-y-2">
              <li> Hint: I met someone new last night and we kicked it.</li>
              <li>No spaces, first letter of each word capitalized.</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-medium">Performance Note</h3>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mt-2">
            <p className="text-amber-700">
              Search times may take a while as I am a broke college student
              paying for the absolute cheapest $5 linode server. Theres also ~
              10 Million records, creating an efficient full text search index
              takes up too much storage and pushes my database into a higher
              pricing tier :(
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-medium">Limitations</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mt-2">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                The graph is not 100% complete due to parsing challenges with
                Wikipedia&apos;s content, see the github readme for more info.
              </li>
              <li>
                The actual name of the link may not match the page. For example,
                in the parent article, you might read &quot;Waterloo
                University&quot; as the page title, but the true page title
                might be &quot;University of Waterloo&quot;
              </li>
              <li>
                The database is a snapshot of wikipedia as of February 2024
              </li>
            </ul>
          </div>
        </section>
      </div>
    </ExplanationModal>
  );
}
