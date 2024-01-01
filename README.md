# tataku-collector-buffer 

The collector module for tataku.vim.

This collect from specified buffer.

## Contents 

- [tataku-collector-buffer-dependencies](tataku-collector-buffer-dependencies)
- [tataku-collector-buffer-options](tataku-collector-buffer-options)
- [tataku-collector-buffer-samples](tataku-collector-buffer-samples)

## Dependencies 

This plugin needs:

- [denops.vim](https://github.com/vim-denops/denops.vim)
- [tataku.vim](https://github.com/Omochice/tataku.vim)

## Options 

This module have some options:

- `bufname` 

  Used as argument of [bufnr](bufnr).
  Default: `""` (current buffer)
- `start` 

  Start line number to collect lines.
  Default: `1`
- `end` 

  Start line number to collect lines.
  Default: `"$"`

## Samples 

```vim
let g:tataku_recipes = #{
  \   sample: #{
  \     collector: #{ name: 'buffer', options: { bufname: '', start: 1, end: '$' } }
  \   }
  \ }
```

