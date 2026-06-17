function Encode-Html {
    param([string]$Text)
    [System.Net.WebUtility]::HtmlEncode($Text)
}

function Get-Paragraphs {
    param([string]$Path)
    $content = Get-Content -LiteralPath $Path -Raw
    ($content -split "(\r?\n){2,}") | Where-Object { $_ -and $_.Trim() }
}

$layouts = @(
    [pscustomobject]@{
        Number = 1
        Title = 'ConstraintLayout'
        Folder = 'assignment/constraintlayout'
        Preview = 'ui_preview.svg'
        XmlFile = 'activity_main.xml'
        KotlinFile = 'MainActivity.kt'
        DescriptionFile = 'constraintlayout_description.txt'
        Intro = 'This sample screen presents a movie booking summary with aligned labels, a poster area, and two action buttons arranged using constraints.'
        Note = 'Why this fits: ConstraintLayout is used here to position each view precisely against the parent, a guideline, and neighboring elements without deep nesting.'
    },
    [pscustomobject]@{
        Number = 2
        Title = 'RelativeLayout'
        Folder = 'assignment/relativelayout'
        Preview = '../relativelayout/ui_preview.svg'
        XmlFile = 'activity_main.xml'
        KotlinFile = 'MainActivity.kt'
        DescriptionFile = 'relativelayout_description.txt'
        Intro = 'This sample screen shows a featured movie panel where the poster, text block, and action buttons are placed by referring to the parent and to neighboring views.'
        Note = 'Why this fits: RelativeLayout makes it easy to say that one view should appear below another, beside another, or attached to an edge of the parent.'
    },
    [pscustomobject]@{
        Number = 3
        Title = 'LinearLayout'
        Folder = 'assignment/linearlayout'
        Preview = '../linearlayout/ui_preview.svg'
        XmlFile = 'activity_main.xml'
        KotlinFile = 'MainActivity.kt'
        DescriptionFile = 'linearlayout_description.txt'
        Intro = 'This sample screen builds a simple showtime planner using vertical and horizontal rows, making the order of views very easy to follow.'
        Note = 'Why this fits: LinearLayout is best when the interface naturally flows in one direction and child views can be grouped into rows or columns.'
    },
    [pscustomobject]@{
        Number = 4
        Title = 'FrameLayout'
        Folder = 'assignment/framelayout'
        Preview = '../framelayout/ui_preview.svg'
        XmlFile = 'activity_main.xml'
        KotlinFile = 'MainActivity.kt'
        DescriptionFile = 'framelayout_description.txt'
        Intro = 'This sample screen uses one main content area to stack a poster, an overlay, a badge, a play icon, and a bottom information panel.'
        Note = 'Why this fits: FrameLayout is designed for layered content, where each new child view can appear on top of the previous one in the same space.'
    }
)

$report = New-Object System.Text.StringBuilder

$header = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Android Layouts Assignment Report</title>
    <style>
        :root {
            color-scheme: light;
        }

        * {
            box-sizing: border-box;
        }

        body {
            font-family: "Segoe UI", Arial, sans-serif;
            margin: 32px;
            color: #1e293b;
            background: #ffffff;
            line-height: 1.65;
        }

        h1, h2, h3 {
            color: #0f172a;
            margin-top: 0;
        }

        h2 {
            margin-bottom: 10px;
        }

        .cover {
            border: 2px solid #cbd5e1;
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 30px;
            background: linear-gradient(135deg, #f8fbff, #fef7ed);
        }

        .meta p,
        .intro p,
        .section p {
            margin: 8px 0;
        }

        .tag-row {
            margin-top: 18px;
        }

        .tag {
            display: inline-block;
            margin-right: 8px;
            margin-bottom: 8px;
            padding: 8px 12px;
            border-radius: 999px;
            background: #e2e8f0;
            color: #0f172a;
            font-size: 13px;
            font-weight: 600;
        }

        .section {
            page-break-before: always;
            padding-top: 12px;
        }

        .layout-card {
            border: 1px solid #dbe4ee;
            border-radius: 18px;
            padding: 22px;
            margin-bottom: 24px;
            background: #fcfdff;
        }

        .preview {
            border: 2px dashed #94a3b8;
            border-radius: 16px;
            padding: 14px;
            margin: 18px 0 22px;
            background: #f8fafc;
            text-align: center;
        }

        .preview img {
            max-width: 280px;
            width: 100%;
            border-radius: 20px;
            box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
        }

        pre {
            background: #0f172a;
            color: #e2e8f0;
            padding: 18px;
            border-radius: 14px;
            overflow-x: auto;
            font-size: 12px;
            white-space: pre-wrap;
            word-break: break-word;
            margin: 14px 0 20px;
        }

        .note {
            border-left: 4px solid #2563eb;
            padding: 10px 14px;
            background: #eff6ff;
            border-radius: 10px;
            color: #1e3a8a;
            margin: 14px 0 20px;
        }
    </style>
</head>
<body>
    <section class="cover">
        <h1>Android Layouts Assignment Report</h1>
        <p>This updated report includes four Android UI examples prepared using <strong>ConstraintLayout</strong>, <strong>RelativeLayout</strong>, <strong>LinearLayout</strong>, and <strong>FrameLayout</strong>. Each section contains a preview, XML layout code, Kotlin activity code, and a short explanation of how the selected layout manager works.</p>
        <div class="meta">
            <p><strong>Student Name:</strong> ....................................</p>
            <p><strong>Index Number:</strong> ....................................</p>
            <p><strong>Module:</strong> Mobile Application Development</p>
            <p><strong>Submission Date:</strong> 08 April 2026</p>
        </div>
        <div class="tag-row">
            <span class="tag">ConstraintLayout</span>
            <span class="tag">RelativeLayout</span>
            <span class="tag">LinearLayout</span>
            <span class="tag">FrameLayout</span>
        </div>
    </section>

    <section class="intro layout-card">
        <h2>Assignment Overview</h2>
        <p>The sample application theme used in this report is <strong>Prince Cinema</strong>. The idea was to build a different user interface for each Android layout type while keeping the overall domain consistent. This makes it easier to compare how the same mobile application concept can be implemented with different layout managers.</p>
        <p>The four selected examples demonstrate different strengths. ConstraintLayout shows flexible responsive positioning, RelativeLayout focuses on view-to-view relationships, LinearLayout demonstrates ordered rows and columns, and FrameLayout highlights layered content. Together they provide a practical comparison for Android UI development.</p>
    </section>
"@

[void]$report.AppendLine($header)

foreach ($layout in $layouts) {
    $xml = Encode-Html (Get-Content -LiteralPath (Join-Path $layout.Folder $layout.XmlFile) -Raw)
    $kotlin = Encode-Html (Get-Content -LiteralPath (Join-Path $layout.Folder $layout.KotlinFile) -Raw)
    $paragraphs = Get-Paragraphs (Join-Path $layout.Folder $layout.DescriptionFile)

    [void]$report.AppendLine('    <section class="section">')
    [void]$report.AppendLine('        <div class="layout-card">')
    [void]$report.AppendLine("            <h2>$($layout.Number). $($layout.Title)</h2>")
    [void]$report.AppendLine("            <p>$($layout.Intro)</p>")
    [void]$report.AppendLine('')
    [void]$report.AppendLine('            <div class="preview">')
    [void]$report.AppendLine(('                <img src="{0}" alt="{1} UI preview" />' -f $layout.Preview, $layout.Title))
    [void]$report.AppendLine('            </div>')
    [void]$report.AppendLine('')
    [void]$report.AppendLine(('            <div class="note">{0}</div>' -f $layout.Note))
    [void]$report.AppendLine('')
    [void]$report.AppendLine('            <h3>activity_main.xml</h3>')
    [void]$report.AppendLine("            <pre>$xml</pre>")
    [void]$report.AppendLine('')
    [void]$report.AppendLine('            <h3>MainActivity.kt</h3>')
    [void]$report.AppendLine("            <pre>$kotlin</pre>")
    [void]$report.AppendLine('')
    [void]$report.AppendLine("            <h3>About $($layout.Title)</h3>")
    foreach ($paragraph in $paragraphs) {
        [void]$report.AppendLine("            <p>$paragraph</p>")
    }
    [void]$report.AppendLine('        </div>')
    [void]$report.AppendLine('    </section>')
}

$footer = @"
</body>
</html>
"@

[void]$report.AppendLine($footer)
Set-Content -LiteralPath 'assignment/constraintlayout/report.html' -Encoding utf8 -Value $report.ToString()

