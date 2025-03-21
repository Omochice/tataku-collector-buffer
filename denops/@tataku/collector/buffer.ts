import { Denops } from "jsr:@denops/std@7.5.0";
import * as fn from "jsr:@denops/std@7.5.0/function";
import {
  as,
  assert,
  is,
  type PredicateType,
} from "jsr:@core/unknownutil@4.3.0";
import type { CollectorFactory } from "jsr:@omochice/tataku-vim@1.2.1";

const isOption = is.ObjectOf({
  // fn.BufNameArg
  bufname: as.Optional(is.UnionOf([is.Number, is.String])),
  // fn.BufLnumArg
  start: as.Optional(is.UnionOf([is.Number, is.LiteralOf("$")])),
  // fn.BufLnumArg
  end: as.Optional(is.UnionOf([is.Number, is.LiteralOf("$")])),
});

const defaultOption: Required<PredicateType<typeof isOption>> = {
  bufname: "",
  start: 1,
  end: "$",
} as const;

const collector: CollectorFactory = (denops: Denops, option: unknown) => {
  assert(option, isOption);
  const opt = { ...defaultOption, ...option };
  return new ReadableStream<string[]>({
    start: async (controller: ReadableStreamDefaultController<string[]>) => {
      const bufnr = await fn.bufnr(denops, opt.bufname);
      if (bufnr === -1) {
        const err = new Error(
          `buffer (${opt.bufname}) is seems like not existed.`,
        );
        controller.error(err);
        throw err;
      }
      const lines = await fn.getbufline(denops, bufnr, opt.start, opt.end);
      controller.enqueue(lines.map((line) => `${line}\n`));
      controller.close();
    },
  });
};

export default collector;
