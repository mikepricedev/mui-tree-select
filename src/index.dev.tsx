import React, { useState } from "react";
import ReactDOM from "react-dom";
import _sampleData from "./sampleData.json";
import TreeSelect, { TreeSelectProps, FreeSoloNode } from "./index";
import { TextField } from "@mui/material";

interface City {
  id: string;
  name: string;
}

interface State {
  id: string;
  name: string;
  cities: City[];
}

interface Country {
  id: string;
  name: string;
  emoji: string;
  states: State[];
}

const sampleData = _sampleData as ReadonlyArray<Country>;

class Node {
  constructor(readonly value: City | State | Country) {}
  getParent() {
    const parent = (() => {
      if ("states" in this.value) {
        return null;
      } else if ("cities" in this.value) {
        return (
          sampleData.find(({ states }) =>
            states.some(({ id }) => id === this.value.id)
          ) || null
        );
      } else {
        for (const { states } of sampleData) {
          const state = states.find(({ cities }) =>
            cities.some(({ id }) => id === this.value.id)
          );
          if (state) {
            return state;
          }
        }
        return null;
      }
    })();

    return parent ? new Node(parent) : parent;
  }
  getChildren() {
    if ("states" in this.value) {
      return this.value.states.map((state) => new Node(state));
    } else if ("cities" in this.value) {
      return this.value.cities.map((city) => new Node(city));
    } else {
      return null;
    }
  }

  isBranch() {
    return "states" in this.value || "cities" in this.value;
  }

  isEqual(to: Node) {
    return to.value.id === this.value.id;
  }

  toString() {
    return this.value.name;
  }
}

const syncOrAsync = function <T>(value: T, returnAsync: boolean) {
  if (returnAsync) {
    return new Promise<T>((resolve) =>
      setTimeout(() => resolve(value), Math.random() * 1000)
    );
  }
  return value;
};

const renderInput: TreeSelectProps<
  Node,
  true | false,
  true | false,
  true | false
>["renderInput"] = (params) => <TextField {...params} />;

const Sample: React.FC = () => {
  const [runAsync, setRynAsync] = useState(false);

  return (
    <>
      <div style={{ width: 450 }}>
        <TreeSelect
          freeSolo
          getParent={(node: Node) => syncOrAsync(node.getParent(), runAsync)}
          getChildren={(node) =>
            syncOrAsync(
              node
                ? node.getChildren()
                : sampleData.map((country) => new Node(country)),
              runAsync
            )
          }
          isBranch={(node) => syncOrAsync(node.isBranch(), runAsync)}
          isOptionEqualToValue={([option], [value]) => {
            return value instanceof FreeSoloNode
              ? false
              : option.isEqual(value);
          }}
          getOptionDisabled={([option, type]) =>
            type === "downBranch" && !option.getChildren()?.length
          }
          renderInput={renderInput}
        />
      </div>
      <div style={{ width: 450 }}>
        <TreeSelect
          multiple
          freeSolo
          getParent={(node: Node) => syncOrAsync(node.getParent(), runAsync)}
          getChildren={(node) =>
            syncOrAsync(
              node
                ? node.getChildren()
                : sampleData.map((country) => new Node(country)),
              runAsync
            )
          }
          isBranch={(node) => syncOrAsync(node.isBranch(), runAsync)}
          isOptionEqualToValue={([option], [value]) => {
            return value instanceof FreeSoloNode
              ? option instanceof FreeSoloNode &&
                  value.toString() === option.toString()
              : option.isEqual(value);
          }}
          getOptionDisabled={([option, type]) =>
            type === "downBranch" && !option.getChildren()?.length
          }
          renderInput={renderInput}
        />
      </div>
    </>
  );
};

ReactDOM.render(<Sample />, document.getElementById("root"));
