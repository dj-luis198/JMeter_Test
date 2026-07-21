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

    var data = {"OkPercent": 98.59484777517564, "KoPercent": 1.405152224824356};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7243243243243244, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7da143c2-eb0e-4841-82ab-b5e785158dc6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=86292d7d-2147-4818-b201-776bf397764a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ace486f6-5ead-41f3-ae5a-1bbbd9229776"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/97ef34c5-db47-4465-9ad0-48325ac3ee35"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5909090909090909, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=17ad0413-33b2-4d36-8e11-a3f6fd421963"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de3b85e7-f64a-43e0-89d6-5907264cabd5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6c855bc9-dffd-482a-b88d-43f16811e309"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.45454545454545453, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5ff9d815-6c0e-470b-9458-b99d34013f65"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=225efe78-81ec-4947-a6cf-a2a3d231a72c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=741b965b-bf18-43ef-829c-a8dd4b963608"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6591e1ca-b15f-44fb-8805-fdb29ec2d667"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5055d6aa-02e8-4cfd-857b-1dfc463c562a"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/72e4c15d-1b06-45f7-b60d-47a73187329d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/86292d7d-2147-4818-b201-776bf397764a"], "isController": false}, {"data": [0.19047619047619047, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.26785714285714285, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.19047619047619047, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.225, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/17ad0413-33b2-4d36-8e11-a3f6fd421963"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/73223e81-3a9a-42d4-8d9f-689d3fb2affc"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/de3b85e7-f64a-43e0-89d6-5907264cabd5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f4eb5196-7aac-4813-aeaf-fa1e12c5e7c2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7da143c2-eb0e-4841-82ab-b5e785158dc6"], "isController": false}, {"data": [0.27586206896551724, 500, 1500, "addBook"], "isController": true}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9732142857142857, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.38392857142857145, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9069767441860465, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/741b965b-bf18-43ef-829c-a8dd4b963608"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ff9d815-6c0e-470b-9458-b99d34013f65"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/225efe78-81ec-4947-a6cf-a2a3d231a72c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5055d6aa-02e8-4cfd-857b-1dfc463c562a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=97ef34c5-db47-4465-9ad0-48325ac3ee35"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72e4c15d-1b06-45f7-b60d-47a73187329d"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1281, 18, 1.405152224824356, 492.497267759563, 134, 3501, 160.0, 1371.3999999999996, 1653.7999999999997, 2122.340000000004, 5.083595582311786, 724.9719464074536, 3.7226157748217172], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2319.0535714285716, 1812, 2995, 2275.0, 2701.6000000000004, 2823.6, 2995.0, 0.2446109157621159, 294.34944689540697, 1.2027499617795443], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7da143c2-eb0e-4841-82ab-b5e785158dc6", 1, 0, 0.0, 1146.0, 1146, 1146, 1146.0, 1146.0, 1146.0, 1146.0, 0.8726003490401396, 0.1576475239965096, 0.6016170375218151], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=86292d7d-2147-4818-b201-776bf397764a", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 0.6593578923357664, 2.5162522810218975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ace486f6-5ead-41f3-ae5a-1bbbd9229776", 1, 0, 0.0, 325.0, 325, 325, 325.0, 325.0, 325.0, 325.0, 3.076923076923077, 0.9825721153846153, 1.8359375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/97ef34c5-db47-4465-9ad0-48325ac3ee35", 3, 0, 0.0, 748.6666666666666, 237, 1341, 668.0, 1341.0, 1341.0, 1341.0, 0.02447940466087865, 0.024551121666721062, 0.01569805572328481], "isController": false}, {"data": ["deleteBook", 11, 1, 9.090909090909092, 571.8181818181818, 146, 935, 563.0, 929.0, 935.0, 935.0, 0.06860250461507758, 0.01310658646410218, 0.04632983421581101], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, 9.090909090909092, 571.8181818181818, 146, 935, 563.0, 929.0, 935.0, 935.0, 0.0714810217887151, 0.01365653044116787, 0.048273804398682146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 203.3846153846154, 138, 417, 142.0, 415.4, 417.0, 417.0, 0.07776887091563872, 0.02080924866297364, 0.04435255919407521], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 183.07692307692307, 139, 416, 140.0, 416.0, 416.0, 416.0, 0.07777026663236798, 0.05779606729221879, 0.03903702836820034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 182.3846153846154, 137, 424, 139.0, 420.8, 424.0, 424.0, 0.07777073188241065, 0.020961642577681, 0.045796632153411745], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=17ad0413-33b2-4d36-8e11-a3f6fd421963", 1, 0, 0.0, 1591.0, 1591, 1591, 1591.0, 1591.0, 1591.0, 1591.0, 0.6285355122564426, 0.11355377906976745, 0.4333457730986801], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 256.46153846153845, 137, 549, 143.0, 495.79999999999995, 549.0, 549.0, 0.07777026663236798, 0.020961517178255434, 0.04572041065691946], "isController": false}, {"data": ["goToProfile", 11, 1, 9.090909090909092, 281.36363636363643, 140, 504, 247.0, 477.0000000000001, 504.0, 504.0, 0.06856829402084476, 0.1548204387279958, 0.044322243320824815], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 159.05882352941174, 137, 419, 141.0, 205.3999999999998, 419.0, 419.0, 0.09049870107746688, 0.06725538234370342, 0.04542610581427537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 206.70588235294122, 136, 428, 143.0, 420.0, 428.0, 428.0, 0.09050400080921225, 0.032212935949786255, 0.05116844990603556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 932.4, 802, 1125, 829.0, 1125.0, 1125.0, 1125.0, 0.07100759781296599, 20.87859143115813, 0.04049652062770716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1519.4, 1488, 1549, 1521.0, 1549.0, 1549.0, 1549.0, 0.07057661091114405, 63.50495855829628, 0.040181800938668924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 307.6, 136, 421, 418.0, 421.0, 421.0, 421.0, 0.07169281064494852, 0.12686266883656905, 0.03969709339422443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 247.62500000000003, 141, 439, 143.0, 434.8, 439.0, 439.0, 0.08628313811773335, 0.06412252744882331, 0.04331009081300287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 230.81249999999997, 138, 438, 142.0, 434.5, 438.0, 438.0, 0.08628406872526075, 0.039287057659328925, 0.04830306874683176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 409.12500000000006, 138, 1519, 289.5, 1395.8000000000002, 1519.0, 1519.0, 0.0862849993528625, 9.725273702084863, 0.04979925255619311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 347.625, 138, 1105, 151.5, 1093.1, 1105.0, 1105.0, 0.0861488760263831, 3.186646082918293, 0.049804818952752725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de3b85e7-f64a-43e0-89d6-5907264cabd5", 1, 0, 0.0, 1538.0, 1538, 1538, 1538.0, 1538.0, 1538.0, 1538.0, 0.6501950585175553, 0.11746688068920676, 0.44827901495448635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c855bc9-dffd-482a-b88d-43f16811e309", 1, 0, 0.0, 328.0, 328, 328, 328.0, 328.0, 328.0, 328.0, 3.048780487804878, 0.973585175304878, 1.8191453887195121], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 140.2, 135, 152, 138.0, 152.0, 152.0, 152.0, 0.071982839291113, 0.05349505927786816, 0.040420051359755835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 253.52941176470588, 136, 1242, 142.0, 585.9999999999994, 1242.0, 1242.0, 0.09050207356221486, 4.813189121717303, 0.052747819299301], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 1197.6428571428573, 134, 1962, 1483.5, 1946.0, 1962.0, 1962.0, 0.1003461943705785, 64.5017861846585, 0.0528329432972326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 224.23529411764707, 139, 696, 141.0, 483.99999999999983, 696.0, 696.0, 0.09050400080921225, 1.5883223386499998, 0.05283732538051609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 816.5714285714287, 139, 1173, 1103.5, 1151.5, 1173.0, 1173.0, 0.10035050999562758, 21.083714949000438, 0.052933214047637824], "isController": false}, {"data": ["deleteBooks", 11, 1, 9.090909090909092, 813.5454545454546, 146, 1591, 645.0, 1580.4, 1591.0, 1591.0, 0.07173881852687597, 0.013705782800944344, 0.04899562597010448], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 695.4999999999999, 282, 1953, 563.0, 1811.6000000000001, 1953.0, 1953.0, 0.08608166998439769, 12.989684070183461, 0.19084659304890514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 710.9500000000002, 206, 2300, 511.5, 1579.6000000000004, 2264.7499999999995, 2300.0, 0.10188746529458213, 0.0625851715530197, 0.046068258233780794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 142.42857142857142, 136, 150, 142.0, 149.5, 150.0, 150.0, 0.10035122930255896, 0.07457742724535876, 0.05037161314601104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 200.0, 137, 417, 141.5, 415.5, 417.0, 417.0, 0.10034979069900797, 0.1345090386490051, 0.05121087254143013], "isController": false}, {"data": ["login", 20, 0, 0.0, 3511.95, 2152, 6449, 3292.0, 5278.400000000001, 6390.849999999999, 6449.0, 0.09988114144168439, 30.010113160651326, 0.1921053789740209], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5ff9d815-6c0e-470b-9458-b99d34013f65", 3, 0, 0.0, 455.33333333333337, 260, 810, 296.0, 810.0, 810.0, 810.0, 0.028289076644538322, 0.028371954798770367, 0.018141107093014485], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=225efe78-81ec-4947-a6cf-a2a3d231a72c", 1, 0, 0.0, 643.0, 643, 643, 643.0, 643.0, 643.0, 643.0, 1.5552099533437014, 0.2809705482115085, 1.072244362363919], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 146.17647058823528, 141, 150, 147.0, 149.2, 150.0, 150.0, 0.09084739241263953, 0.07354735186531072, 0.03229340902168046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=741b965b-bf18-43ef-829c-a8dd4b963608", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1342.0000000000002, 279, 2111, 1634.0, 2092.0, 2111.0, 2111.0, 0.10024631952798305, 85.70828164382482, 0.20713563595549062], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6591e1ca-b15f-44fb-8805-fdb29ec2d667", 1, 0, 0.0, 364.0, 364, 364, 364.0, 364.0, 364.0, 364.0, 2.7472527472527473, 0.8772965315934066, 1.6392299107142858], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5055d6aa-02e8-4cfd-857b-1dfc463c562a", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 462.38461538461536, 279, 966, 290.0, 912.8, 966.0, 966.0, 0.07770379314054823, 0.120425702845752, 0.17475765195574472], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 1225.857142857143, 140, 1685, 1660.0, 1685.0, 1685.0, 1685.0, 0.07116497056820147, 60.81833044437441, 0.1280929757632443], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72e4c15d-1b06-45f7-b60d-47a73187329d", 3, 0, 0.0, 881.6666666666667, 369, 1761, 515.0, 1761.0, 1761.0, 1761.0, 0.02033140185015757, 0.02403102868421944, 0.013038040900003389], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86292d7d-2147-4818-b201-776bf397764a", 3, 0, 0.0, 421.0, 247, 522, 494.0, 522.0, 522.0, 522.0, 0.08456659619450317, 0.03826418252290345, 0.054230532064834386], "isController": false}, {"data": ["register", 21, 6, 28.571428571428573, 1300.0000000000002, 232, 3213, 1291.0, 1915.4, 3084.499999999998, 3213.0, 0.08400672053764302, 0.026392736418913515, 0.037901469617569405], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 155.79999999999998, 139, 212, 152.5, 171.70000000000002, 209.99999999999997, 212.0, 0.08750973545806971, 0.0679396871964506, 0.03110697627611072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 497.82352941176464, 281, 1384, 548.0, 956.7999999999996, 1384.0, 1384.0, 0.0904293799736159, 6.495726048182902, 0.20201678296150902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 562.1875, 279, 1671, 551.5, 1115.2000000000005, 1671.0, 1671.0, 0.07480445647549452, 5.701945040055449, 0.16704076200027118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 140.83333333333331, 137, 146, 140.0, 145.7, 146.0, 146.0, 0.08471405476763641, 0.06295644109196417, 0.04252248452203625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 138.5, 136, 142, 138.5, 141.7, 142.0, 142.0, 0.08471166267815922, 0.02266698786505432, 0.048312120121137676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 187.91666666666666, 136, 424, 141.0, 422.8, 424.0, 424.0, 0.08471226068786356, 0.022832601513525723, 0.04980154388095103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 222.0, 135, 559, 143.0, 517.9000000000001, 559.0, 559.0, 0.08471465281111457, 0.022833246265495724, 0.04988567934092], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 146.0, 146, 146, 146.0, 146.0, 146.0, 146.0, 6.8493150684931505, 2.0200128424657535, 4.234000428082192], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1568.0000000000002, 1082, 2408, 1493.5, 2069.3, 2202.95, 2408.0, 0.2424977265838133, 290.11158684449833, 0.4788382843285844], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, 28.571428571428573, 1300.0000000000002, 232, 3213, 1291.0, 1915.4, 3084.499999999998, 3213.0, 0.0852888856397885, 0.026795559495089796, 0.03847994645076394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 139.16666666666666, 134, 147, 138.5, 147.0, 147.0, 147.0, 0.0344833531612614, 0.009294341281746237, 0.020306115191641234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 184.33333333333334, 136, 409, 140.5, 409.0, 409.0, 409.0, 0.03442893867058392, 0.009279674876055822, 0.020240450273136246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 258.15, 135, 1684, 139.0, 423.6, 1620.999999999999, 1684.0, 0.0894854586129754, 4.048871819071588, 0.052223154362416105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 228.89999999999998, 135, 1103, 140.0, 414.0, 1068.5499999999995, 1103.0, 0.08948625938487145, 1.3385099503127544, 0.05231101061307036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 141.1, 137, 145, 141.0, 144.0, 144.95, 145.0, 0.08948305638327383, 0.06650059170671034, 0.0449162997861355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 185.5, 138, 413, 140.5, 413.0, 413.0, 413.0, 0.03442814845417613, 0.009212219410590097, 0.019634803415272326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 183.55, 136, 431, 140.0, 423.7, 430.65, 431.0, 0.08948305638327383, 0.03066367625477616, 0.0506575466654139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 197.66666666666666, 137, 403, 148.5, 403.0, 403.0, 403.0, 0.03447899367310466, 0.025623549009016255, 0.017306838621070113], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 232.83333333333334, 142, 410, 146.5, 410.0, 410.0, 410.0, 0.03701944137662963, 0.029138349364808084, 0.013159254551848814], "isController": false}, {"data": ["deleteAccount", 11, 1, 9.090909090909092, 819.0909090909091, 140, 1761, 668.0, 1742.8000000000002, 1761.0, 1761.0, 0.07287857104998145, 0.013742372595007154, 0.04959935419648063], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1728.55, 986, 3409, 1559.5, 3108.9, 3394.5499999999997, 3409.0, 0.09832503306179237, 0.0508908862526855, 0.045225674386820514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/17ad0413-33b2-4d36-8e11-a3f6fd421963", 3, 0, 0.0, 1573.3333333333333, 504, 2546, 1670.0, 2546.0, 2546.0, 2546.0, 0.019449450877170236, 0.022988592491863646, 0.012472466871102005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 385.5, 280, 817, 289.0, 817.0, 817.0, 817.0, 0.03439716108763823, 0.05330888149031433, 0.07736002146956138], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/73223e81-3a9a-42d4-8d9f-689d3fb2affc", 1, 0, 0.0, 363.0, 363, 363, 363.0, 363.0, 363.0, 363.0, 2.7548209366391188, 0.879713326446281, 1.6437456955922864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de3b85e7-f64a-43e0-89d6-5907264cabd5", 3, 0, 0.0, 423.0, 315, 603, 351.0, 603.0, 603.0, 603.0, 0.026370380788298585, 0.026447637763264302, 0.01691069340916283], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4eb5196-7aac-4813-aeaf-fa1e12c5e7c2", 1, 0, 0.0, 649.0, 649, 649, 649.0, 649.0, 649.0, 649.0, 1.5408320493066257, 0.4920430469953775, 0.9193831856702619], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7da143c2-eb0e-4841-82ab-b5e785158dc6", 3, 0, 0.0, 580.0, 229, 1103, 408.0, 1103.0, 1103.0, 1103.0, 0.023325609964700577, 0.027570081309188733, 0.014958154827623742], "isController": false}, {"data": ["addBook", 58, 8, 13.793103448275861, 1539.1551724137933, 709, 5868, 1152.0, 2518.2, 2828.7999999999993, 5868.0, 0.28326536592513, 88.7591792248663, 1.029603214817709], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 252.9821428571428, 136, 570, 146.0, 563.3, 567.0, 570.0, 0.24389606543383013, 0.18125479081557103, 0.11789897694311124], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 893.1785714285711, 673, 1403, 831.0, 1138.7, 1221.45, 1403.0, 0.24354497101379943, 71.61030793217272, 0.1224859961641667], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 214.1428571428572, 135, 560, 145.0, 422.90000000000003, 555.15, 560.0, 0.2443931412810565, 0.43246130078249445, 0.11885525816207629], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1309.9107142857142, 938, 1843, 1272.5, 1601.3000000000002, 1677.9999999999998, 1843.0, 0.2431378678545688, 218.77588088632436, 0.12204381257543787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 166.3125, 141, 420, 145.5, 246.40000000000018, 420.0, 420.0, 0.07330370641865579, 0.05476302286159344, 0.02605717689100655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 8, 4.651162790697675, 257.4418604651165, 137, 3501, 148.5, 431.80000000000024, 611.2999999999995, 2308.9100000000167, 0.7074870225490921, 1.5495559696274175, 0.33941124328504324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 170.74999999999997, 143, 405, 149.5, 331.2000000000003, 405.0, 405.0, 0.08414498180364768, 0.06516305719755139, 0.02991091150051539], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 145.23076923076923, 139, 163, 144.0, 157.0, 163.0, 163.0, 0.07952529516119165, 0.06453664089741237, 0.028268757264329848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 365.49999999999994, 278, 699, 287.5, 657.9000000000001, 699.0, 699.0, 0.08462921823759653, 0.13115875912408761, 0.19033309531365705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 444.75, 276, 1825, 287.0, 570.6, 1762.299999999999, 1825.0, 0.0894254415381176, 5.480858239716074, 0.19997589704896043], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/741b965b-bf18-43ef-829c-a8dd4b963608", 3, 0, 0.0, 579.6666666666666, 239, 1067, 433.0, 1067.0, 1067.0, 1067.0, 0.0200455702630647, 0.023693185424865863, 0.012854743951249173], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ff9d815-6c0e-470b-9458-b99d34013f65", 1, 0, 0.0, 1042.0, 1042, 1042, 1042.0, 1042.0, 1042.0, 1042.0, 0.9596928982725528, 0.1733820177543186, 0.6616632677543186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 147.0, 141, 161, 146.5, 154.0, 161.0, 161.0, 0.08919263937743538, 0.0739497566713307, 0.03170519602869773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/225efe78-81ec-4947-a6cf-a2a3d231a72c", 3, 0, 0.0, 1383.3333333333333, 234, 3118, 798.0, 3118.0, 3118.0, 3118.0, 0.028421471474316465, 0.023693811343009265, 0.01822600872539174], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5055d6aa-02e8-4cfd-857b-1dfc463c562a", 3, 0, 0.0, 602.0, 249, 1055, 502.0, 1055.0, 1055.0, 1055.0, 0.02975275460919757, 0.024803647315805654, 0.01907972870446589], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 151.64285714285717, 142, 198, 147.5, 179.0, 198.0, 198.0, 0.09612083762444217, 0.07462506436663234, 0.034167953999313425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=97ef34c5-db47-4465-9ad0-48325ac3ee35", 1, 0, 0.0, 907.0, 907, 907, 907.0, 907.0, 907.0, 907.0, 1.1025358324145536, 0.1991886025358324, 0.7601467750826901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 178.06249999999997, 138, 444, 141.0, 418.8, 444.0, 444.0, 0.07485485176400138, 0.05562943573477054, 0.03757362676435225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 174.625, 136, 422, 141.0, 413.6, 422.0, 422.0, 0.07486045543229575, 0.027058326237185997, 0.04230090920362512], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72e4c15d-1b06-45f7-b60d-47a73187329d", 1, 0, 0.0, 645.0, 645, 645, 645.0, 645.0, 645.0, 645.0, 1.550387596899225, 0.28009932170542634, 1.0689195736434107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 346.1875, 135, 1531, 276.5, 751.2000000000007, 1531.0, 1531.0, 0.07486220675069949, 4.228988174403208, 0.043608697584758056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 317.875, 136, 1086, 274.0, 628.9000000000004, 1086.0, 1086.0, 0.0748597549278773, 1.3946193235251458, 0.04368037457949872], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 33.333333333333336, 0.468384074941452], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.555555555555555, 0.078064012490242], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.555555555555555, 0.078064012490242], "isController": false}, {"data": ["401/Unauthorized", 10, 55.55555555555556, 0.78064012490242], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1281, 18, "401/Unauthorized", 10, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
