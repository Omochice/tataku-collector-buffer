import { Denops } from "jsr:@denops/std@7.6.0";
import * as fn from "jsr:@denops/std@7.6.0/function";
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

const defaultOption = {
  bufname: "",
  start: 1,
  end: "$",
} as const satisfies Required<PredicateType<typeof isOption>>;

const collector: CollectorFactory = (denops: Denops, option: unknown) => {
  assert(option, isOption);
  const opt = { ...defaultOption, ...option };
  return new ReadableStream<string[]>({
    start: async (controller: ReadableStreamDefaultController<string[]>) => {
      const bufnr = await fn.bufnr(denops, opt.bufname);
      using _ = {
        [Symbol.dispose]: () => {
          controller.close();
        },
      };
      if (bufnr === -1) {
        const err = new Error(
          `buffer (${opt.bufname}) is seems like not existed.`,
        );
        controller.error(err);
        return;
      }
      const lines = await fn.getbufline(denops, bufnr, opt.start, opt.end);
      controller.enqueue(lines.map((line) => `${line}\n`));
    },
  });
};

export default collector;
