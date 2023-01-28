#!/usr/bin/env python
#
# Check the token definitions and the output files for expected number of leaf nodes.
#
# This linter helps preventing nesting mistakes since style-dictionary has some
# peculiar behavour when nesting tokens and a 'value' key is discovered.
#
# Run as ./bin/check_token_nesting.py
#
from pathlib import Path
import json
import os
import sys

ROOT_DIR = Path(__file__).parent.parent

CONFIG_FILE = ROOT_DIR / "style-dictionary.config.json"


def get_emitted_var_count() -> int:
  test_file = ROOT_DIR / "lib" / "css" / "root.css"
  if not test_file.exists():
    print(
      f"Test file {test_file} does not exist, please run 'npm run build' first."
    )
    sys.exit(1)

  num_found = 0
  test_prefix = "--"
  with open(test_file, "r") as infile:
    for line in infile:
      if line.strip().startswith(test_prefix):
        num_found += 1

  return num_found


def count_leaf_nodes(data: dict) -> int:
  num_leaf_nodes = 0
  for key, value in data.items():
    if key == "value":
      if isinstance(value, (dict, list)):
        raise TypeError("The 'value' key value must be a scalar")
      num_leaf_nodes += 1
      continue

    if key == "comment":
      continue

    if isinstance(value, dict):
      num_leaf_nodes += count_leaf_nodes(value)
    else:
      raise TypeError("Expected nested object")

  return num_leaf_nodes


def main():
  os.chdir(ROOT_DIR)

  with open(CONFIG_FILE, "r") as config_file:
    config = json.load(config_file)

  NUM_LEAVES = 0

  # check the source files
  for path_glob in config["source"]:
    for path in ROOT_DIR.glob(path_glob):
      with open(path, "r") as source_file:
        tokens_definition = json.load(source_file)

      NUM_LEAVES += count_leaf_nodes(tokens_definition)

  print(f"Found {NUM_LEAVES} leaf nodes in the source JSON files.")
  num_emitted = get_emitted_var_count()
  if NUM_LEAVES != num_emitted:
    print(
      f"Found {num_emitted} emitted variables, while {NUM_LEAVES} were expected.",
      file=sys.stdout
    )
    sys.exit(1)
  else:
    print("OK.")


if __name__ == "__main__":
  main()
