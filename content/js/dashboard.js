/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.35164835164835, "KoPercent": 1.6483516483516483};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.751338688085676, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.13392857142857142, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8bb24aa8-706f-429e-8560-4a034a6eb526"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2aef00cf-4c27-4a98-b76a-21ce7192f7ae"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/89906182-d2c2-4cc1-917d-68fa90194aad"], "isController": false}, {"data": [0.40625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.40625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a1a8ef68-7353-4c34-8f37-6ae5e06cf51c"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3ef0215-ec7b-4f43-bbc1-6a19cf281d49"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/119bcd67-9613-45c9-ad7a-882aaef54f00"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d3a235bd-6b2c-447e-9ac8-571fc61403dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.53125, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8ad8bdde-9029-4369-afc0-61efe22303a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d171d17a-9a22-4377-abf3-04be7e8247da"], "isController": false}, {"data": [0.6739130434782609, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/8bb24aa8-706f-429e-8560-4a034a6eb526"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a4a58747-4a0d-4d5d-bc3a-a75cd9f83e88"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=77a124e8-1716-4224-8b67-6d216d684301"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bb1fcb69-4e77-4926-9874-85d780eef546"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c9865c54-ae49-434d-9bc5-6686395ae7ca"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fed7f039-b7d1-4e79-85ee-7825f9561987"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/187ef2b6-d36e-4ff8-a5d8-a2be7b50f793"], "isController": false}, {"data": [0.24, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3a235bd-6b2c-447e-9ac8-571fc61403dd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/77a124e8-1716-4224-8b67-6d216d684301"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a4a58747-4a0d-4d5d-bc3a-a75cd9f83e88"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=119bcd67-9613-45c9-ad7a-882aaef54f00"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.48214285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.24, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.375, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89906182-d2c2-4cc1-917d-68fa90194aad"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ad8bdde-9029-4369-afc0-61efe22303a2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f3ef0215-ec7b-4f43-bbc1-6a19cf281d49"], "isController": false}, {"data": [0.33653846153846156, 500, 1500, "addBook"], "isController": true}, {"data": [0.9732142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.93125, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d171d17a-9a22-4377-abf3-04be7e8247da"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2aef00cf-4c27-4a98-b76a-21ce7192f7ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/64435f00-b221-4965-a683-1d893ebdd870"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb1fcb69-4e77-4926-9874-85d780eef546"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=187ef2b6-d36e-4ff8-a5d8-a2be7b50f793"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c9865c54-ae49-434d-9bc5-6686395ae7ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fed7f039-b7d1-4e79-85ee-7825f9561987"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1274, 21, 1.6483516483516483, 426.0376766091053, 103, 6481, 218.0, 958.5, 1241.25, 3174.25, 4.917760681847133, 714.3417982094469, 3.5916372012769195], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1723.196428571429, 1286, 2742, 1707.5, 2289.8, 2425.3999999999996, 2742.0, 0.25248995676109487, 303.83057786525376, 1.2414911448165165], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8bb24aa8-706f-429e-8560-4a034a6eb526", 1, 0, 0.0, 576.0, 576, 576, 576.0, 576.0, 576.0, 576.0, 1.736111111111111, 0.31365288628472227, 1.196967230902778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2aef00cf-4c27-4a98-b76a-21ce7192f7ae", 3, 0, 0.0, 402.3333333333333, 352, 431, 424.0, 431.0, 431.0, 431.0, 0.035797386790764274, 0.029493224598770955, 0.02295600650319193], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89906182-d2c2-4cc1-917d-68fa90194aad", 3, 0, 0.0, 1061.6666666666665, 216, 2751, 218.0, 2751.0, 2751.0, 2751.0, 0.036103689797097265, 0.030098160667436882, 0.023152431282643753], "isController": false}, {"data": ["deleteBook", 16, 2, 12.5, 1130.25, 112, 4782, 624.5, 3358.9000000000015, 4782.0, 4782.0, 0.08571964319198522, 0.01671072634003911, 0.05774984262409258], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, 12.5, 1130.25, 112, 4782, 624.5, 3358.9000000000015, 4782.0, 4782.0, 0.08629942664818421, 0.016823752973284933, 0.05814044624894148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 165.81250000000006, 105, 340, 110.0, 338.6, 340.0, 340.0, 0.09592153618340198, 0.02566650479907436, 0.05470525110459644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 112.9375, 106, 125, 113.0, 118.7, 125.0, 125.0, 0.09591866097549277, 0.07128330176010743, 0.04814667162246415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 166.56249999999997, 103, 346, 111.0, 341.8, 346.0, 346.0, 0.09592556176407108, 0.025854936569222286, 0.056487415765366075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 161.0, 108, 432, 112.5, 370.4000000000001, 432.0, 432.0, 0.09591981103797226, 0.02585338656882846, 0.056390357660995406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a1a8ef68-7353-4c34-8f37-6ae5e06cf51c", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 3.3003300330033003, 1.0539139851485149, 1.969239892739274], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 562.5, 110, 3633, 311.5, 1921.5000000000018, 3633.0, 3633.0, 0.0843583754685844, 0.1626205402099469, 0.05452607398756768], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 123.72222222222221, 104, 333, 111.5, 137.7000000000003, 333.0, 333.0, 0.11290858795265367, 0.08390960491403265, 0.05667481856217186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 170.88888888888889, 106, 331, 114.0, 328.3, 331.0, 331.0, 0.11290717148717562, 0.058475035753937636, 0.0628119648670518], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 709.0, 528, 783, 741.0, 783.0, 783.0, 783.0, 0.06450839991521753, 18.96761145553989, 0.0367899468266475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 915.8571428571428, 765, 999, 943.0, 999.0, 999.0, 999.0, 0.06448225356264452, 58.02124510337887, 0.03671206428420093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3ef0215-ec7b-4f43-bbc1-6a19cf281d49", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/119bcd67-9613-45c9-ad7a-882aaef54f00", 3, 0, 0.0, 1904.0, 921, 3633, 1158.0, 3633.0, 3633.0, 3633.0, 0.0555823174120873, 0.0251495511727869, 0.03564360849668359], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 206.14285714285714, 105, 335, 119.0, 335.0, 335.0, 335.0, 0.0648802958541491, 0.11480771102316226, 0.035924929442678256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 114.79999999999998, 111, 130, 113.5, 128.6, 130.0, 130.0, 0.0555784044551649, 0.04130387284216845, 0.027897753798783946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3a235bd-6b2c-447e-9ac8-571fc61403dd", 3, 0, 0.0, 1252.6666666666667, 1141, 1429, 1188.0, 1429.0, 1429.0, 1429.0, 0.016782371796664784, 0.02313585434859224, 0.010762132955543497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 154.7, 104, 336, 112.5, 334.7, 336.0, 336.0, 0.055514228296712445, 0.014854393118456261, 0.03166045832546882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 177.4, 108, 339, 114.0, 338.7, 339.0, 339.0, 0.05557964006625093, 0.014980449861606697, 0.0326747493358233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 180.0, 109, 352, 113.5, 349.6, 352.0, 352.0, 0.05557964006625093, 0.014980449861606697, 0.0327290263280755], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 141.85714285714286, 109, 312, 113.0, 312.0, 312.0, 312.0, 0.06488630991555511, 0.04822117367747796, 0.036435183790472836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 553.7500000000001, 105, 1109, 519.5, 1093.0000000000002, 1108.6, 1109.0, 0.09976505329947973, 44.89783006332587, 0.054364159903427425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 263.5555555555556, 103, 933, 113.0, 779.1000000000003, 933.0, 933.0, 0.11291496248714024, 16.958875380695932, 0.06476437627029333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 447.80000000000007, 107, 884, 435.0, 877.6, 883.8, 884.0, 0.09965320684019613, 14.664105631153586, 0.05440052990592737], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 259.3888888888889, 107, 777, 111.5, 770.7, 777.0, 777.0, 0.11291071271750994, 5.558610559190305, 0.06487220310755372], "isController": false}, {"data": ["deleteBooks", 16, 2, 12.5, 753.5625000000001, 113, 3495, 512.0, 2403.700000000001, 3495.0, 3495.0, 0.08714217245435929, 0.01698804314082175, 0.05930390764563635], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8ad8bdde-9029-4369-afc0-61efe22303a2", 3, 0, 0.0, 512.6666666666666, 222, 890, 426.0, 890.0, 890.0, 890.0, 0.01978787399081843, 0.023388597155163317, 0.012689489505830827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 340.19999999999993, 222, 465, 344.0, 463.9, 465.0, 465.0, 0.05547850208044383, 0.08598084257975035, 0.12477245145631068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d171d17a-9a22-4377-abf3-04be7e8247da", 3, 0, 0.0, 1274.3333333333333, 244, 2925, 654.0, 2925.0, 2925.0, 2925.0, 0.06435420554733252, 0.029118602119398505, 0.04126881019799644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 764.0434782608697, 138, 2099, 614.0, 1661.0000000000002, 2024.599999999999, 2099.0, 0.09721952167995333, 0.05971785071942446, 0.04395765482208828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 136.5, 105, 342, 111.5, 299.8000000000003, 340.5, 342.0, 0.09976156984806313, 0.0741392135296641, 0.05007563174014106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 189.29999999999998, 107, 343, 114.5, 339.0, 342.8, 343.0, 0.09965717930319701, 0.1015062871222993, 0.052650912112333574], "isController": false}, {"data": ["login", 23, 0, 0.0, 4154.17391304348, 1611, 10693, 3682.0, 7876.400000000001, 10150.799999999992, 10693.0, 0.09273221355825599, 33.88989539529122, 0.18671256365260092], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 161.44444444444443, 108, 458, 116.0, 352.70000000000016, 458.0, 458.0, 0.10640121533832632, 0.08613926515182863, 0.037822307014795685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 717.35, 221, 1220, 771.5, 1206.3000000000002, 1219.7, 1220.0, 0.09959762559260588, 59.65387140639317, 0.21125590115931636], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8bb24aa8-706f-429e-8560-4a034a6eb526", 3, 0, 0.0, 2529.3333333333335, 276, 4148, 3164.0, 4148.0, 4148.0, 4148.0, 0.042995342171264786, 0.02764186223575779, 0.02757188283769258], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4a58747-4a0d-4d5d-bc3a-a75cd9f83e88", 3, 0, 0.0, 512.6666666666666, 390, 582, 566.0, 582.0, 582.0, 582.0, 0.08892050506846878, 0.040176321951508685, 0.057022589513308436], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=77a124e8-1716-4224-8b67-6d216d684301", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 0.7590926995798319, 2.8968618697478994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb1fcb69-4e77-4926-9874-85d780eef546", 3, 0, 0.0, 542.0, 458, 666, 502.0, 666.0, 666.0, 666.0, 0.029153668989242296, 0.024019510485602944, 0.018695549449481548], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c9865c54-ae49-434d-9bc5-6686395ae7ca", 3, 0, 0.0, 1744.0, 224, 4758, 250.0, 4758.0, 4758.0, 4758.0, 0.01662528817166164, 0.022919301890295264, 0.010661398990290831], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fed7f039-b7d1-4e79-85ee-7825f9561987", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.34023363935969864, 1.298405131826742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 331.9375, 218, 550, 234.0, 486.30000000000007, 550.0, 550.0, 0.09585372721227407, 0.14855455574792867, 0.21557727907213592], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 734.7272727272729, 110, 1312, 898.0, 1271.8000000000002, 1312.0, 1312.0, 0.10122761489334291, 77.0756621781422, 0.1696443258470911], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/187ef2b6-d36e-4ff8-a5d8-a2be7b50f793", 3, 0, 0.0, 804.0, 253, 1812, 347.0, 1812.0, 1812.0, 1812.0, 0.018427744812589835, 0.02178097051253701, 0.011817271250261059], "isController": false}, {"data": ["register", 25, 8, 32.0, 1053.6799999999998, 225, 2898, 933.0, 2385.8000000000006, 2805.0, 2898.0, 0.10192640913260625, 0.031899780858220365, 0.04598632912037509], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 133.21428571428572, 111, 351, 116.5, 238.5, 351.0, 351.0, 0.07376496374978923, 0.05726869744246333, 0.026221139457932894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 454.72222222222223, 218, 1050, 437.0, 903.3000000000002, 1050.0, 1050.0, 0.11282790610210926, 22.642617852273798, 0.24894125897138558], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3a235bd-6b2c-447e-9ac8-571fc61403dd", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/77a124e8-1716-4224-8b67-6d216d684301", 3, 0, 0.0, 1731.3333333333333, 359, 3945, 890.0, 3945.0, 3945.0, 3945.0, 0.05533523932491008, 0.02503775477266439, 0.03548516323895601], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a4a58747-4a0d-4d5d-bc3a-a75cd9f83e88", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 0.6766444288389513, 2.5822214419475653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 337.58823529411757, 220, 769, 229.0, 531.3999999999997, 769.0, 769.0, 0.08011951947139968, 0.12416960683702276, 0.1801906770924155], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=119bcd67-9613-45c9-ad7a-882aaef54f00", 1, 0, 0.0, 3495.0, 3495, 3495, 3495.0, 3495.0, 3495.0, 3495.0, 0.2861230329041488, 0.05169214949928469, 0.1972684191702432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 4, 0, 0.0, 163.5, 105, 322, 113.5, 322.0, 322.0, 322.0, 0.03441245042456361, 0.025574096458098543, 0.01727343702951728], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 4, 0, 0.0, 111.25, 107, 115, 111.5, 115.0, 115.0, 115.0, 0.03441215437292452, 0.02212930044391679, 0.018903160971455116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 4, 0, 0.0, 328.75, 104, 990, 110.5, 990.0, 990.0, 990.0, 0.0341527138600251, 7.689571909072669, 0.019344310584779843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 4, 0, 0.0, 282.75, 110, 795, 113.0, 795.0, 795.0, 795.0, 0.03420967107401262, 2.521610222491148, 0.019409979388673178], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 115.5, 113, 118, 115.5, 118.0, 118.0, 118.0, 0.09687575684185032, 0.028570779849842576, 0.05988511140712037], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1063.6785714285725, 822, 1963, 905.5, 1411.3, 1480.2999999999997, 1963.0, 0.25262208187662116, 302.22383557009135, 0.49882993120559377], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 1053.6799999999998, 225, 2898, 933.0, 2385.8000000000006, 2805.0, 2898.0, 0.0988982732361493, 0.0309520689518761, 0.044620119370215795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 169.22222222222223, 110, 340, 116.0, 340.0, 340.0, 340.0, 0.042349752489224346, 0.011414581725611248, 0.024938379639650662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 118.88888888888889, 109, 150, 113.0, 150.0, 150.0, 150.0, 0.04234995176811049, 0.01141463543749853, 0.02489713961367433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 128.07142857142856, 104, 340, 111.0, 231.0, 340.0, 340.0, 0.07569777124133531, 0.020402914904891156, 0.04450201004617564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 187.2857142857143, 104, 331, 114.5, 330.5, 331.0, 331.0, 0.07569531554132963, 0.020402253016999005, 0.04457448756974783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 166.77777777777777, 105, 332, 118.0, 332.0, 332.0, 332.0, 0.042350549616021686, 0.011332080658974552, 0.024153047827887367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 128.57142857142856, 107, 334, 113.0, 225.5, 334.0, 334.0, 0.0756928600006488, 0.056252213340325916, 0.037994267617513164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 165.88888888888889, 111, 340, 116.0, 340.0, 340.0, 340.0, 0.042348756122924325, 0.03147207364213419, 0.02125709047576475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 145.78571428571428, 108, 339, 112.5, 339.0, 339.0, 339.0, 0.07560211685927205, 0.020229472675234905, 0.04311683227130359], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 144.44444444444446, 114, 346, 116.0, 346.0, 346.0, 346.0, 0.041056333851859625, 0.03231582527792857, 0.014594243673903225], "isController": false}, {"data": ["deleteAccount", 16, 2, 12.5, 1272.1875, 116, 4758, 778.5, 3642.200000000001, 4758.0, 4758.0, 0.0876577840112202, 0.016788948133984925, 0.05965480296173738], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 2255.782608695652, 842, 6481, 1705.0, 5580.200000000003, 6424.999999999999, 6481.0, 0.09509319132750095, 0.049218155667554206, 0.043739153432864206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 339.0, 223, 679, 231.0, 679.0, 679.0, 679.0, 0.04232644979847907, 0.0655977303029163, 0.09519317762294657], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89906182-d2c2-4cc1-917d-68fa90194aad", 1, 0, 0.0, 545.0, 545, 545, 545.0, 545.0, 545.0, 545.0, 1.834862385321101, 0.33149369266055045, 1.265051605504587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ad8bdde-9029-4369-afc0-61efe22303a2", 1, 0, 0.0, 1936.0, 1936, 1936, 1936.0, 1936.0, 1936.0, 1936.0, 0.5165289256198348, 0.09331821410123967, 0.3561224819214876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3ef0215-ec7b-4f43-bbc1-6a19cf281d49", 3, 0, 0.0, 963.3333333333334, 227, 1996, 667.0, 1996.0, 1996.0, 1996.0, 0.017788740912918183, 0.02452321541868767, 0.01140749335887006], "isController": false}, {"data": ["addBook", 52, 5, 9.615384615384615, 1206.1346153846155, 559, 5569, 927.0, 1897.0000000000005, 2627.149999999998, 5569.0, 0.2620796016390055, 85.44407785937665, 0.9522533963248375], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 212.62500000000003, 108, 944, 115.0, 460.6, 518.4499999999999, 944.0, 0.2534900143040794, 0.18838466883340274, 0.12253667683644462], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 625.0892857142857, 512, 948, 562.0, 802.9000000000001, 887.0999999999999, 948.0, 0.25340513145391197, 74.50952248970542, 0.12744496357301235], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 162.55357142857144, 104, 431, 114.0, 341.3, 352.7, 431.0, 0.253908375349124, 0.4492988048170046, 0.12348278410533571], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 845.4999999999998, 713, 1136, 783.0, 1021.1, 1098.25, 1136.0, 0.25316455696202533, 227.79791337025318, 0.1270767405063291], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 115.82352941176471, 109, 124, 115.0, 124.0, 124.0, 124.0, 0.0843898613027809, 0.06304516005530018, 0.029997958509972895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 160, 5, 3.125, 220.26874999999998, 107, 3205, 118.0, 364.80000000000007, 593.2499999999998, 2133.839999999976, 0.6778971630003728, 1.5462832633016135, 0.3220425279844423], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 4, 0, 0.0, 116.5, 114, 118, 117.0, 118.0, 118.0, 118.0, 0.03471830435801515, 0.026886343121001972, 0.0123412722522632], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d171d17a-9a22-4377-abf3-04be7e8247da", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 0.8287342316513762, 3.162629013761468], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2aef00cf-4c27-4a98-b76a-21ce7192f7ae", 1, 0, 0.0, 609.0, 609, 609, 609.0, 609.0, 609.0, 609.0, 1.6420361247947455, 0.29665691707717573, 1.1321069376026274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 130.1875, 113, 342, 116.0, 185.90000000000015, 342.0, 342.0, 0.09328575759695888, 0.07570357867487582, 0.03316017164579398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 4, 0, 0.0, 496.75, 221, 1312, 227.0, 1312.0, 1312.0, 1312.0, 0.03412183200116014, 10.24505506677216, 0.07455820224862873], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64435f00-b221-4965-a683-1d893ebdd870", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 1.3705405042918455, 2.5608570278969958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 351.7142857142857, 223, 675, 335.5, 564.0, 675.0, 675.0, 0.07555397251994085, 0.11709390077065052, 0.16992265499357792], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 228.1, 107, 1256, 115.0, 1142.2000000000005, 1256.0, 1256.0, 0.0554535825787025, 0.04597665196222502, 0.019712015682273154], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb1fcb69-4e77-4926-9874-85d780eef546", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.3606069111776447, 1.3761539421157685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 229.65000000000003, 109, 1186, 116.5, 505.30000000000007, 1152.1999999999994, 1186.0, 0.09981783245576822, 0.07749528984603099, 0.03548212013076136], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=187ef2b6-d36e-4ff8-a5d8-a2be7b50f793", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c9865c54-ae49-434d-9bc5-6686395ae7ca", 1, 0, 0.0, 1482.0, 1482, 1482, 1482.0, 1482.0, 1482.0, 1482.0, 0.6747638326585694, 0.12190557523616734, 0.4652180330634278], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fed7f039-b7d1-4e79-85ee-7825f9561987", 3, 0, 0.0, 374.6666666666667, 247, 472, 405.0, 472.0, 472.0, 472.0, 0.032484407484407486, 0.03257957664695946, 0.02083147224748787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 133.99999999999997, 108, 431, 115.0, 199.79999999999978, 431.0, 431.0, 0.08016183259380114, 0.05957339316785416, 0.04023748237618534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 189.23529411764707, 106, 338, 113.0, 338.0, 338.0, 338.0, 0.08016561272464054, 0.02145056434233546, 0.045719451007021565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 126.88235294117646, 107, 335, 112.0, 171.79999999999984, 335.0, 335.0, 0.08016410062952396, 0.02160673024780138, 0.04712772322165374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 160.23529411764707, 104, 331, 112.0, 321.4, 331.0, 331.0, 0.08016447864795534, 0.021606832135581712, 0.04720623107882526], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 38.095238095238095, 0.6279434850863422], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.523809523809524, 0.15698587127158556], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.523809523809524, 0.15698587127158556], "isController": false}, {"data": ["401/Unauthorized", 9, 42.857142857142854, 0.706436420722135], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1274, 21, "401/Unauthorized", 9, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 160, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
