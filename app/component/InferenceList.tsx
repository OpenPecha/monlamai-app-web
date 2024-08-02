import { useLoaderData } from "@remix-run/react";
import useSocket from "./hooks/useSocket";
import { EachInference } from "./EachInference";

export function InferenceList() {
  let { inferences } = useLoaderData();
  let { isConnected, progress, socket } = useSocket();
  return (
    <div className="w-full space-y-2 max-h-[45vh] overflow-auto font-poppins">
      {inferences?.map((inference: any) => {
        return (
          <EachInference
            inference={inference}
            key={inference.id}
            progress={progress}
          />
        );
      })}
    </div>
  );
}
