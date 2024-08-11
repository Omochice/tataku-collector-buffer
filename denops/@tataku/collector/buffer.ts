import { Denops } from "jsr:@denops/std@7.0.3";
import * as fn from "jsr:@denops/std@7.0.3/function";
import { assert, is, PredicateType } from "jsr:@core/unknownutil@4.0.3";

const isOption = is.ObjectOf({
  // fn.BufNameArg
  bufname: is.OptionalOf(is.OneOf([is.Number, is.String])),
  // fn.BufLnumArg
  start: is.OptionalOf(is.OneOf([is.Number, is.LiteralOf("$")])),
  // fn.BufLnumArg
  end: is.OptionalOf(is.OneOf([is.Number, is.LiteralOf("$")])),
});

const defaultOption: Required<PredicateType<typeof isOption>> = {
  bufname: "",
  start: 1,
  end: "$",
} as const;

const collector = (denops: Denops, option: unknown) => {
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
    },
  });
};

export default collector;
