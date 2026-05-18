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

    var data = {"OkPercent": 98.06763285024155, "KoPercent": 1.932367149758454};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7069559228650137, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44e026cc-28fe-4c0b-b37e-35e457e724ef"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dc50f916-114c-4d65-9773-a2da0006442e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a9f8e8fd-2692-4b5f-af46-73c391c2b5ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c532323a-1860-450b-943e-8c814b9c5b3e"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/380838f0-8438-4871-a07e-692ad8f628f9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/37b2fb34-c962-4d6e-a9da-2a430a5f66a3"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/15e46c6d-6c37-4019-9ce0-f2f1d3d8e35c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b57dcde1-ad7d-45e5-9951-70bd3c78835e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/12e0d09d-f853-4050-ad9f-9893e0ff4b9e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3634214-5f21-46a8-84ce-216dc296d288"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9791666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5588235294117647, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0ff47a31-af5b-4ce7-b33b-96084b0c48bd"], "isController": false}, {"data": [0.717391304347826, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4c2f5f71-cc51-4563-8431-845a966a2b4b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/836dd951-841e-4cb3-90a4-6f1bb2d4f987"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/34a7f9be-bfe0-4ca4-8746-050131d4f1f8"], "isController": false}, {"data": [0.47058823529411764, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b58aaf31-6445-4d59-87cd-5ddb08d5ef25"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9f8e8fd-2692-4b5f-af46-73c391c2b5ad"], "isController": false}, {"data": [0.53125, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.05, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=37b2fb34-c962-4d6e-a9da-2a430a5f66a3"], "isController": false}, {"data": [0.8541666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=380838f0-8438-4871-a07e-692ad8f628f9"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/bcd22bf2-5563-4263-8a7f-e12a3c363e97"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/44e026cc-28fe-4c0b-b37e-35e457e724ef"], "isController": false}, {"data": [0.22549019607843138, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a3634214-5f21-46a8-84ce-216dc296d288"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c532323a-1860-450b-943e-8c814b9c5b3e"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=15e46c6d-6c37-4019-9ce0-f2f1d3d8e35c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b57dcde1-ad7d-45e5-9951-70bd3c78835e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ff47a31-af5b-4ce7-b33b-96084b0c48bd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.20909090909090908, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.910828025477707, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ec5e743e-79f1-4f45-a218-cdc959c77d53"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=836dd951-841e-4cb3-90a4-6f1bb2d4f987"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c2f5f71-cc51-4563-8431-845a966a2b4b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc50f916-114c-4d65-9773-a2da0006442e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1242, 24, 1.932367149758454, 529.3864734299511, 138, 3077, 170.0, 1488.4, 1860.3999999999978, 2350.5699999999997, 4.805794813456226, 715.972352713707, 3.501859911758333], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44e026cc-28fe-4c0b-b37e-35e457e724ef", 1, 0, 0.0, 751.0, 751, 751, 751.0, 751.0, 751.0, 751.0, 1.3315579227696406, 0.2405646637816245, 0.9180467709720372], "isController": false}, {"data": ["see books", 55, 0, 0.0, 2603.8909090909087, 1715, 3234, 2542.0, 3101.0, 3147.4, 3234.0, 0.24733663415314186, 297.63108068683135, 1.2161522978135442], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/dc50f916-114c-4d65-9773-a2da0006442e", 3, 0, 0.0, 345.6666666666667, 265, 497, 275.0, 497.0, 497.0, 497.0, 0.03242121644404098, 0.027028234151428698, 0.020790949347252844], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9f8e8fd-2692-4b5f-af46-73c391c2b5ad", 3, 0, 0.0, 353.3333333333333, 260, 490, 310.0, 490.0, 490.0, 490.0, 0.03128747979350263, 0.02543126205871617, 0.020063911195703187], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c532323a-1860-450b-943e-8c814b9c5b3e", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 666.3571428571429, 155, 1268, 583.0, 1250.0, 1268.0, 1268.0, 0.10335459484998819, 0.020359470972123792, 0.06954230063636901], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 666.3571428571429, 155, 1268, 583.0, 1250.0, 1268.0, 1268.0, 0.10355106176820834, 0.02039817232375979, 0.06967449370927299], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 309.75, 141, 447, 416.5, 447.0, 447.0, 447.0, 0.09180312819159313, 0.05903550772867586, 0.050428964460714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/380838f0-8438-4871-a07e-692ad8f628f9", 3, 0, 0.0, 402.3333333333333, 252, 503, 452.0, 503.0, 503.0, 503.0, 0.020549493454986335, 0.024288805577817506, 0.01317789782106871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 205.56249999999997, 145, 446, 150.5, 446.0, 446.0, 446.0, 0.09194556822361162, 0.06833064200993012, 0.04615236529974256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/37b2fb34-c962-4d6e-a9da-2a430a5f66a3", 3, 0, 0.0, 662.0, 262, 1132, 592.0, 1132.0, 1132.0, 1132.0, 0.0430039706999613, 0.027647409548314964, 0.027577416106420494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 398.5, 142, 1143, 149.0, 1140.9, 1143.0, 1143.0, 0.0919492669919372, 6.777621775310473, 0.052170433713198745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 588.25, 144, 2266, 152.5, 1848.1000000000004, 2266.0, 2266.0, 0.0919445114873174, 20.701544703708812, 0.052077945959613375], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 327.7333333333333, 149, 755, 275.0, 657.2, 755.0, 755.0, 0.093709587740287, 0.1398078719177355, 0.060569582492550095], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/15e46c6d-6c37-4019-9ce0-f2f1d3d8e35c", 3, 0, 0.0, 413.0, 264, 504, 471.0, 504.0, 504.0, 504.0, 0.030421643985640984, 0.02536127286693573, 0.019508671436104408], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b57dcde1-ad7d-45e5-9951-70bd3c78835e", 3, 0, 0.0, 595.3333333333334, 370, 956, 460.0, 956.0, 956.0, 956.0, 0.029504327301337528, 0.024596543690991342, 0.018920418223839497], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/12e0d09d-f853-4050-ad9f-9893e0ff4b9e", 1, 0, 0.0, 286.0, 286, 286, 286.0, 286.0, 286.0, 286.0, 3.4965034965034967, 1.116559222027972, 2.0862926136363638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 24, 0, 0.0, 165.08333333333331, 142, 447, 150.5, 176.0, 382.25, 447.0, 0.1139850109710573, 0.08470956381735802, 0.057215132460081496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 24, 0, 0.0, 208.08333333333331, 138, 446, 149.5, 438.5, 445.25, 446.0, 0.11398446961601481, 0.030499750658972712, 0.06500676782788345], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 1040.6666666666665, 883, 1385, 957.0, 1385.0, 1385.0, 1385.0, 0.02989745174052998, 8.790843500543136, 0.017050890445771006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1838.8333333333333, 1330, 2197, 1874.5, 2197.0, 2197.0, 2197.0, 0.02980759199368079, 26.82092367207178, 0.01697053333233975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3634214-5f21-46a8-84ce-216dc296d288", 1, 0, 0.0, 1002.0, 1002, 1002, 1002.0, 1002.0, 1002.0, 1002.0, 0.998003992015968, 0.18030345558882235, 0.6880769710578842], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 298.8333333333333, 148, 460, 293.0, 460.0, 460.0, 460.0, 0.030037697310124206, 0.05315264406830573, 0.016632201537930102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 169.07142857142858, 140, 428, 151.0, 293.5, 428.0, 428.0, 0.06162975484563948, 0.04580101898196449, 0.030935248037752626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 187.35714285714283, 139, 457, 145.5, 442.0, 457.0, 457.0, 0.06155388383023439, 0.023074119119955327, 0.0347356947674802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 343.35714285714283, 139, 2049, 147.0, 1247.0, 2049.0, 2049.0, 0.061553613197094674, 3.9715519603177047, 0.03580895187386785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 281.21428571428567, 143, 1150, 151.0, 797.0, 1150.0, 1150.0, 0.06163111138502716, 1.3098244806478312, 0.03591422324989655], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 150.16666666666666, 145, 154, 151.0, 154.0, 154.0, 154.0, 0.03008212419906344, 0.022355953628405548, 0.016891817787560038], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 24, 0, 0.0, 192.41666666666666, 139, 583, 152.0, 437.0, 547.75, 583.0, 0.11398176291793312, 0.030721647036474165, 0.06700880984042554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 942.8823529411765, 144, 1964, 1319.0, 1858.3999999999999, 1964.0, 1964.0, 0.0984343153603854, 46.90321052385874, 0.05339021172063183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 24, 0, 0.0, 161.87499999999997, 139, 444, 149.0, 167.5, 377.75, 444.0, 0.11398176291793312, 0.030721647036474165, 0.06712012015577508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 640.1764705882355, 138, 1295, 824.0, 1238.2, 1295.0, 1295.0, 0.0984440056286808, 15.336736859896806, 0.05349160439118173], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 553.4285714285714, 154, 1002, 550.0, 876.5, 1002.0, 1002.0, 0.10360317025700987, 0.020408436998172144, 0.07037441908222392], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 538.3571428571429, 286, 2201, 309.0, 1529.5, 2201.0, 2201.0, 0.06151331543588774, 5.34504627641228, 0.13722069110209892], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ff47a31-af5b-4ce7-b33b-96084b0c48bd", 3, 0, 0.0, 454.0, 276, 600, 486.0, 600.0, 600.0, 600.0, 0.04739037027675976, 0.030035498349235433, 0.030390309064198155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 629.9130434782609, 151, 1388, 641.0, 1229.2000000000005, 1385.6, 1388.0, 0.09672196639962993, 0.05941222350133519, 0.04373268597952018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c2f5f71-cc51-4563-8431-845a966a2b4b", 3, 0, 0.0, 652.3333333333334, 464, 755, 738.0, 755.0, 755.0, 755.0, 0.03488980636157469, 0.022430783712275398, 0.022373996918067105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 165.76470588235293, 140, 433, 150.0, 211.3999999999998, 433.0, 433.0, 0.09844172539391167, 0.0731583525632488, 0.04941313169186582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 268.29411764705884, 140, 448, 150.0, 447.2, 448.0, 448.0, 0.09843773523723494, 0.10461271265446039, 0.05176350116967191], "isController": false}, {"data": ["login", 23, 0, 0.0, 3053.4347826086964, 1656, 5360, 2816.0, 4537.8, 5222.5999999999985, 5360.0, 0.09904486301664814, 31.046460115064296, 0.19228211072139112], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/836dd951-841e-4cb3-90a4-6f1bb2d4f987", 3, 0, 0.0, 800.3333333333333, 362, 1627, 412.0, 1627.0, 1627.0, 1627.0, 0.04543251756724013, 0.029208731183365644, 0.029134785028471045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 24, 0, 0.0, 176.70833333333331, 148, 448, 152.0, 297.5, 443.25, 448.0, 0.11189958876901127, 0.09059058504834995, 0.03977680694523447], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34a7f9be-bfe0-4ca4-8746-050131d4f1f8", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.7096354166666666, 1.3259548611111112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1111.0588235294117, 295, 2117, 1469.0, 2009.8, 2117.0, 2117.0, 0.09835344757761244, 62.36492220676209, 0.20787674613528806], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b58aaf31-6445-4d59-87cd-5ddb08d5ef25", 1, 0, 0.0, 627.0, 627, 627, 627.0, 627.0, 627.0, 627.0, 1.594896331738437, 0.5093077153110048, 0.9516422448165869], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9f8e8fd-2692-4b5f-af46-73c391c2b5ad", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 886.4374999999999, 297, 2415, 596.0, 2120.3, 2415.0, 2415.0, 0.09172418537457865, 27.5401194779174, 0.20042271950744112], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 1255.8999999999996, 149, 2350, 1695.5, 2329.9, 2350.0, 2350.0, 0.04964158773654217, 35.638471485872, 0.08031853765810847], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1171.3333333333333, 163, 1840, 1223.5, 1725.0, 1824.75, 1840.0, 0.09560648371303714, 0.030017074720450624, 0.043134956518967926], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=37b2fb34-c962-4d6e-a9da-2a430a5f66a3", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.34346779942965777, 1.3107473859315588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 24, 0, 0.0, 406.87499999999994, 291, 889, 313.0, 667.0, 850.25, 889.0, 0.1139022433996023, 0.17652623073746956, 0.25616881498953525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 11, 0, 0.0, 180.27272727272725, 142, 470, 152.0, 407.2000000000002, 470.0, 470.0, 0.08312614770760755, 0.06453641350346484, 0.02954874781793862], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=380838f0-8438-4871-a07e-692ad8f628f9", 1, 0, 0.0, 745.0, 745, 745, 745.0, 745.0, 745.0, 745.0, 1.3422818791946307, 0.24250209731543623, 0.9254404362416108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 584.5333333333333, 290, 2056, 309.0, 1801.6000000000001, 2056.0, 2056.0, 0.08051961994739384, 12.952078874000215, 0.17834361915561758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 149.4, 146, 154, 149.0, 154.0, 154.0, 154.0, 0.03138771359339101, 0.02332622074665093, 0.015755160924807592], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 146.8, 144, 152, 145.0, 152.0, 152.0, 152.0, 0.03138869881287941, 0.008398929174539998, 0.017901367291720288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 147.4, 140, 155, 147.0, 155.0, 155.0, 155.0, 0.03138653141164064, 0.008459651044543765, 0.018451847568171545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 266.4, 145, 453, 155.0, 453.0, 453.0, 453.0, 0.03138653141164064, 0.008459651044543765, 0.018482498477753226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 154.5, 154, 155, 154.5, 155.0, 155.0, 155.0, 1.2254901960784315, 0.36142386642156865, 0.7575539981617647], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1850.0545454545454, 1108, 2559, 1829.0, 2441.0, 2516.4, 2559.0, 0.24462709934528892, 292.65905695697234, 0.4830429637462639], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1171.3333333333333, 163, 1840, 1223.5, 1725.0, 1824.75, 1840.0, 0.09448260929472668, 0.029664217664311165, 0.04262789599039427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 147.0, 144, 151, 146.5, 151.0, 151.0, 151.0, 0.025016886398318866, 0.0067428326620468815, 0.014731623533385035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 148.25, 140, 157, 148.0, 157.0, 157.0, 157.0, 0.02501860758939461, 0.006743296576829016, 0.014708204852358941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 11, 0, 0.0, 172.63636363636368, 142, 440, 146.0, 382.2000000000002, 440.0, 440.0, 0.07878076030595582, 0.02123387680121466, 0.046314470414243566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 11, 0, 0.0, 202.0909090909091, 143, 447, 149.0, 446.8, 447.0, 447.0, 0.07878245299910475, 0.02123433303491495, 0.04639240152193375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 149.75, 143, 157, 149.5, 157.0, 157.0, 157.0, 0.025017199324535618, 0.006694055288010508, 0.01426762148977422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 11, 0, 0.0, 150.54545454545453, 144, 163, 150.0, 161.4, 163.0, 163.0, 0.07878471003645583, 0.05854996517357704, 0.03954623140501787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 148.25, 145, 150, 149.0, 150.0, 150.0, 150.0, 0.025017199324535618, 0.01859188348239415, 0.012557461379698544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 11, 0, 0.0, 199.54545454545456, 143, 460, 148.0, 451.0, 460.0, 460.0, 0.07860680163216305, 0.021033460592981126, 0.04483044155584298], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 152.5, 150, 156, 152.0, 156.0, 156.0, 156.0, 0.024511305839818615, 0.01929307862001348, 0.008713003247748024], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 610.3571428571429, 149, 1627, 493.5, 1379.5, 1627.0, 1627.0, 0.0996661185030149, 0.01924356975560444, 0.06782524080046132], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1522.6956521739128, 839, 3077, 1463.0, 1994.2, 2866.199999999997, 3077.0, 0.0985897380942175, 0.05102789178704617, 0.045347428361695745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 300.5, 297, 303, 301.0, 303.0, 303.0, 303.0, 0.02499343922220417, 0.03873494926331838, 0.05621083059446895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bcd22bf2-5563-4263-8a7f-e12a3c363e97", 2, 0, 0.0, 427.5, 290, 565, 427.5, 565.0, 565.0, 565.0, 0.06357885367326827, 0.03908485194074451, 0.039519473010776615], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44e026cc-28fe-4c0b-b37e-35e457e724ef", 3, 0, 0.0, 703.3333333333334, 248, 1381, 481.0, 1381.0, 1381.0, 1381.0, 0.036346454403372946, 0.02336726804904348, 0.02330811040841299], "isController": false}, {"data": ["addBook", 51, 9, 17.647058823529413, 1553.5294117647054, 784, 3076, 1200.0, 2564.4, 3063.2, 3076.0, 0.2383266664174362, 90.39873204956261, 0.8622365263654717], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a3634214-5f21-46a8-84ce-216dc296d288", 3, 0, 0.0, 527.0, 239, 1051, 291.0, 1051.0, 1051.0, 1051.0, 0.051236507719633825, 0.03247313819340074, 0.03285674485927039], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c532323a-1860-450b-943e-8c814b9c5b3e", 3, 0, 0.0, 476.3333333333333, 380, 533, 516.0, 533.0, 533.0, 533.0, 0.043095398847916334, 0.027706189037967045, 0.027636046787238015], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 258.8545454545455, 141, 610, 151.0, 593.8, 602.0, 610.0, 0.24721323265012587, 0.18371999028002517, 0.11950249039239483], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=15e46c6d-6c37-4019-9ce0-f2f1d3d8e35c", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 933.4909090909092, 686, 1481, 881.0, 1211.6, 1288.6, 1481.0, 0.2466688493122424, 72.52883187443659, 0.12405708730059066], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b57dcde1-ad7d-45e5-9951-70bd3c78835e", 1, 0, 0.0, 715.0, 715, 715, 715.0, 715.0, 715.0, 715.0, 1.3986013986013985, 0.2526770104895105, 0.9642701048951049], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ff47a31-af5b-4ce7-b33b-96084b0c48bd", 1, 0, 0.0, 635.0, 635, 635, 635.0, 635.0, 635.0, 635.0, 1.574803149606299, 0.28451033464566927, 1.0857529527559056], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 243.3818181818182, 140, 449, 152.0, 445.0, 447.2, 449.0, 0.2477700693756194, 0.4384368805748266, 0.12049755327056492], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1589.5090909090911, 958, 2351, 1600.0, 1924.8, 2215.5999999999995, 2351.0, 0.2453341897726867, 220.75213520896898, 0.12314626322574314], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 155.73333333333332, 144, 172, 154.0, 166.0, 172.0, 172.0, 0.08007772878207113, 0.05982369386551212, 0.028465130153001846], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 157, 9, 5.732484076433121, 219.4203821656051, 140, 669, 156.0, 416.20000000000005, 516.9, 639.9999999999993, 0.6352726007331937, 1.474394493157669, 0.30088594858945206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 272.2, 150, 448, 159.0, 448.0, 448.0, 448.0, 0.03144179494919006, 0.024348968158894254, 0.011176575548344904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 192.74999999999997, 147, 440, 158.5, 440.0, 440.0, 440.0, 0.09110112794584038, 0.0739307005107357, 0.032383604074497946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec5e743e-79f1-4f45-a218-cdc959c77d53", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 1.2876449092741935, 2.4059664818548385], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=836dd951-841e-4cb3-90a4-6f1bb2d4f987", 1, 0, 0.0, 585.0, 585, 585, 585.0, 585.0, 585.0, 585.0, 1.7094017094017093, 0.3088274572649573, 1.1785523504273505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 417.8, 298, 600, 310.0, 600.0, 600.0, 600.0, 0.03135700578223187, 0.04859723454726755, 0.07052264093406249], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 11, 0, 0.0, 433.3636363636364, 292, 612, 305.0, 610.4, 612.0, 612.0, 0.07852543510229722, 0.12169908740951729, 0.17660554398495168], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c2f5f71-cc51-4563-8431-845a966a2b4b", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.3147457534843206, 1.2011378484320558], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 153.35714285714283, 147, 163, 153.0, 161.0, 163.0, 163.0, 0.06287302792011533, 0.05212812568767374, 0.022349396643478497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 193.0, 142, 475, 157.0, 430.99999999999994, 475.0, 475.0, 0.09845198728231977, 0.07643489247016036, 0.0349966048542621], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc50f916-114c-4d65-9773-a2da0006442e", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 167.0, 141, 428, 149.0, 263.0000000000001, 428.0, 428.0, 0.08135240233644099, 0.06045818181448398, 0.04083509257903386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 246.60000000000002, 140, 463, 155.0, 451.6, 463.0, 463.0, 0.08122641049661827, 0.038000845431555914, 0.045414870660479015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 371.06666666666666, 138, 1906, 147.0, 1649.2000000000003, 1906.0, 1906.0, 0.08058364044654082, 9.686730678057613, 0.046451012533442214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 308.8666666666667, 142, 1215, 150.0, 1197.6, 1215.0, 1215.0, 0.08089654949250898, 3.19039980423035, 0.04671038394850665], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 29.166666666666668, 0.5636070853462157], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.333333333333334, 0.1610305958132045], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.333333333333334, 0.1610305958132045], "isController": false}, {"data": ["401/Unauthorized", 13, 54.166666666666664, 1.0466988727858293], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1242, 24, "401/Unauthorized", 13, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 157, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
