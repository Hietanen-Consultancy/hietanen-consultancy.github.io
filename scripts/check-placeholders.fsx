// Lists every bracketed placeholder still left in the investor decks, so none
// of them reaches a reader. Replaces the grep in docs/pitch-decks/PLACEHOLDERS.md:
// it knows which deck a slide belongs to, and whether a placeholder sits on the
// slide itself or down in the speaker notes, which a line-based search cannot.
//
//   dotnet fsi scripts/check-placeholders.fsx            all decks
//   dotnet fsi scripts/check-placeholders.fsx fuuga      one deck
//   dotnet fsi scripts/check-placeholders.fsx --strict   exit 1 if any remain
//
// Run --strict as the last gate before a deck goes out; the plain form is the
// working inventory while the numbers are still open.

open System
open System.IO
open System.Text.RegularExpressions

let decksRoot =
    Path.GetFullPath(Path.Combine(__SOURCE_DIRECTORY__, "..", "docs", "pitch-decks"))

/// A placeholder is [anything on one line], which is how the decks mark an open
/// figure, name or address. The upper bound keeps a stray bracket in prose from
/// swallowing the rest of a slide.
let placeholder = Regex(@"\[[^\]\r\n]{1,80}\]", RegexOptions.Compiled)

type Hit =
    { Slide: string
      Line: int
      Text: string
      InNotes: bool }

let lineOf (text: string) (index: int) =
    let mutable line = 1
    for i in 0 .. index - 1 do
        if text[i] = '\n' then line <- line + 1
    line

let hitsIn (path: string) =
    let text = File.ReadAllText path
    // Everything after <aside> is speaker notes: read by anyone who opens the
    // deck, but never on screen. Worth separating, not worth ignoring.
    let notesAt =
        match text.IndexOf("<aside>", StringComparison.Ordinal) with
        | -1 -> Int32.MaxValue
        | i -> i

    [ for m in placeholder.Matches text ->
        { Slide = Path.GetFileNameWithoutExtension path
          Line = lineOf text m.Index
          Text = m.Value
          InNotes = m.Index > notesAt } ]

let scan (deck: string) =
    let slides = Path.Combine(decksRoot, deck, "slides")

    if not (Directory.Exists slides) then
        []
    else
        Directory.GetFiles(slides, "*.html")
        |> Array.sortBy Path.GetFileName
        |> Array.toList
        |> List.collect hitsIn

let args = fsi.CommandLineArgs |> Array.skip 1 |> Array.toList
let strict = args |> List.contains "--strict"
let named = args |> List.filter (fun a -> not (a.StartsWith "--"))

let decks =
    Directory.GetDirectories decksRoot
    |> Array.map Path.GetFileName
    |> Array.sort
    |> Array.filter (fun d -> List.isEmpty named || List.contains d named)
    |> Array.toList

if List.isEmpty decks then
    eprintfn "No deck matched %A under %s" named decksRoot
    exit 2

let mutable total = 0
let mutable onSlides = 0

for deck in decks do
    let hits = scan deck
    total <- total + hits.Length
    onSlides <- onSlides + (hits |> List.filter (fun h -> not h.InNotes) |> List.length)

    let slideCount = hits |> List.map _.Slide |> List.distinct |> List.length
    printfn ""
    printfn "%s — %d placeholder(s) across %d slide(s)" deck hits.Length slideCount

    if hits.IsEmpty then
        printfn "  none"
    else
        // Same text twice on one line is one thing to fill in, not two.
        for (slide, line, text), group in
            hits
            |> List.groupBy (fun h -> h.Slide, h.Line, h.Text)
            |> List.sortBy (fun ((s, l, _), _) -> s, l) do
            let where = if group |> List.forall _.InNotes then " · notes" else ""
            let times = if group.Length > 1 then $" ×%d{group.Length}" else ""
            printfn "  %-28s %s%s%s" $"%s{slide}.html:%d{line}" text times where

printfn ""
printfn "%d placeholder(s) in total, %d of them on the slides themselves." total onSlides

if strict && total > 0 then
    printfn "Not ready to send: fill them in, or drop --strict while the numbers are open."
    exit 1
