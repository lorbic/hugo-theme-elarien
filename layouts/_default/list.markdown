# {{ .Title }} - Lorbic Technical Journal

> **Source:** [{{ .Permalink }}]({{ .Permalink }})
> **Author:** [{{ site.Params.author }}]({{ site.Params.author_url }})
> 
> *A curated list of articles from [Lorbic.com]({{ site.BaseURL }}).*

---

{{ range .Pages }}
- **[{{ .Title }}]({{ .Permalink }})** - {{ .Date.Format "Jan 2006" }}
  *Source:* `{{ .Permalink }}index.md`
{{ end }}
