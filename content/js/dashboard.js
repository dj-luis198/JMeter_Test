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

    var data = {"OkPercent": 97.77942264988897, "KoPercent": 2.220577350111029};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7175984752223634, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8f9bc30-9d56-4d99-8050-5f41154a0380"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35be728e-787e-4044-9c2b-6b75b38f3bdc"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c2539cf8-2347-4156-926a-e6427ab634c0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a62903bc-7662-4dd2-a314-840a42ee24ba"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.78125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5180781-c901-4523-9803-979eb30ebd9e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4e65f5a9-6a6f-447d-bcd6-ec5a521710e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5588235294117647, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.868421052631579, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6086956521739131, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e48abdaa-48b9-4589-a8a1-1df9e248c125"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=84064373-53e2-4bf3-a705-810f0d77dbcb"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a5180781-c901-4523-9803-979eb30ebd9e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1085974-ec92-411c-8c92-6cbe603eeb86"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd4d6c00-335e-433b-87da-0b1a4496d655"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/40334334-7151-4a90-bad6-a9f305ec5155"], "isController": false}, {"data": [0.47058823529411764, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/35be728e-787e-4044-9c2b-6b75b38f3bdc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a8d36a86-c0e8-4d8f-bfbb-ab79f56361fe"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c372ee51-659c-4540-ba3b-e087a632d228"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e65f5a9-6a6f-447d-bcd6-ec5a521710e7"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c8f9bc30-9d56-4d99-8050-5f41154a0380"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/69377a50-e301-4cc2-a6dc-01c2db91dc09"], "isController": false}, {"data": [0.19298245614035087, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5d51dc7a-05ac-4b0f-9f53-f1410c7e574f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a62903bc-7662-4dd2-a314-840a42ee24ba"], "isController": false}, {"data": [0.27049180327868855, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2539cf8-2347-4156-926a-e6427ab634c0"], "isController": false}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.30701754385964913, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9050279329608939, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c1085974-ec92-411c-8c92-6cbe603eeb86"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c372ee51-659c-4540-ba3b-e087a632d228"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/84064373-53e2-4bf3-a705-810f0d77dbcb"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e48abdaa-48b9-4589-a8a1-1df9e248c125"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fbb11670-9301-4f23-a32f-d1bddc1185f8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69377a50-e301-4cc2-a6dc-01c2db91dc09"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/cd4d6c00-335e-433b-87da-0b1a4496d655"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1351, 30, 2.220577350111029, 479.6262028127314, 135, 3914, 152.0, 1366.1999999999998, 1648.0, 2191.4400000000005, 5.311432356884222, 737.1592879299567, 3.8861241901146815], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2312.9298245614036, 1670, 3256, 2304.0, 2778.2, 2846.0, 3256.0, 0.2477851485406759, 298.16875703688083, 1.2183576395530302], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8f9bc30-9d56-4d99-8050-5f41154a0380", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 0.4717077349869452, 1.8001387075718016], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35be728e-787e-4044-9c2b-6b75b38f3bdc", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.3528594970703125, 1.346588134765625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2539cf8-2347-4156-926a-e6427ab634c0", 3, 0, 0.0, 652.6666666666666, 367, 829, 762.0, 829.0, 829.0, 829.0, 0.08703725194383195, 0.039382089909481256, 0.055814904404084945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a62903bc-7662-4dd2-a314-840a42ee24ba", 3, 0, 0.0, 733.0, 283, 1240, 676.0, 1240.0, 1240.0, 1240.0, 0.02173361828521752, 0.029961547343065165, 0.013937248705038577], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 751.8571428571428, 142, 2213, 596.0, 1735.5, 2213.0, 2213.0, 0.07155671636450991, 0.014095714774928571, 0.048147048413229816], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 751.8571428571428, 142, 2213, 596.0, 1735.5, 2213.0, 2213.0, 0.07239032865209208, 0.01425992523113198, 0.04870794574344868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 157.49999999999997, 136, 416, 140.0, 227.7000000000002, 416.0, 416.0, 0.10391027347885101, 0.02780411614570818, 0.059261327843407215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 158.4375, 137, 410, 141.5, 225.9000000000002, 410.0, 410.0, 0.10390554985518163, 0.07721887054667308, 0.052155715454651724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 243.875, 135, 433, 140.5, 424.6, 433.0, 433.0, 0.10372300770791601, 0.027956591921274237, 0.061079075828001324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 226.12499999999997, 138, 415, 141.5, 415.0, 415.0, 415.0, 0.10372569739324357, 0.02795731687552268, 0.06097936506907484], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 271.37500000000006, 139, 543, 255.0, 419.8000000000001, 543.0, 543.0, 0.07592077666954533, 0.14619754052271455, 0.04906769434532565], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5180781-c901-4523-9803-979eb30ebd9e", 1, 0, 0.0, 314.0, 314, 314, 314.0, 314.0, 314.0, 314.0, 3.1847133757961785, 0.5753632563694268, 2.1957105891719744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 141.57894736842104, 137, 150, 141.0, 149.0, 150.0, 150.0, 0.09734354586674182, 0.07234222500448292, 0.048861897046391885], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 1037.857142857143, 829, 1105, 1086.0, 1105.0, 1105.0, 1105.0, 0.03553371642063798, 10.448092458095596, 0.020265322646145098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 168.4736842105263, 138, 414, 140.0, 410.0, 414.0, 414.0, 0.0972100709633518, 0.04906470481394504, 0.05415104590361877], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1469.2857142857142, 1213, 1655, 1531.0, 1655.0, 1655.0, 1655.0, 0.0355126247380944, 31.954322163873005, 0.020218613498348664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 261.7142857142857, 138, 424, 152.0, 424.0, 424.0, 424.0, 0.035657524756510045, 0.06309710435429317, 0.019743961461856634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 141.6, 139, 147, 141.5, 146.5, 147.0, 147.0, 0.06689007953230457, 0.04971030324617556, 0.03357568445273881], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 194.0, 137, 415, 139.0, 414.9, 415.0, 415.0, 0.06689052696357142, 0.017898441785174385, 0.03814850365891183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e65f5a9-6a6f-447d-bcd6-ec5a521710e7", 3, 0, 0.0, 512.6666666666666, 272, 943, 323.0, 943.0, 943.0, 943.0, 0.035511783993655226, 0.029257918388001753, 0.022772856271972917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 166.79999999999998, 137, 415, 139.5, 387.7000000000001, 415.0, 415.0, 0.06689052696357142, 0.018029087345650112, 0.03932431370319336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 166.20000000000002, 138, 405, 140.0, 378.6000000000001, 405.0, 405.0, 0.0668909744008241, 0.018029207943972118, 0.03938989996454778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 139.85714285714286, 136, 143, 140.0, 143.0, 143.0, 143.0, 0.03570809145352337, 0.026536970308721958, 0.020050930259546813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 957.0, 136, 1927, 1240.0, 1832.6, 1927.0, 1927.0, 0.08204039282870448, 39.09162980630022, 0.04449824156069782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 363.1052631578946, 135, 1626, 141.0, 1512.0, 1626.0, 1626.0, 0.09720261116909162, 13.832022496968815, 0.055825553926985495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 638.0588235294117, 138, 1244, 822.0, 1228.0, 1244.0, 1244.0, 0.0820368297108443, 12.780638720056558, 0.04457642303738949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 331.47368421052636, 136, 1091, 141.0, 1077.0, 1091.0, 1091.0, 0.09734653830586283, 4.5415342294765315, 0.05600327936150918], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 489.2857142857143, 141, 775, 497.0, 762.5, 775.0, 775.0, 0.07317430118542367, 0.01441435732056616, 0.04970503243189563], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 365.1, 280, 556, 283.5, 556.0, 556.0, 556.0, 0.06682705159048383, 0.10356887780673618, 0.1502956052860198], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 738.6086956521739, 327, 1272, 761.0, 1190.2, 1263.8, 1272.0, 0.10104338275672707, 0.06206668725974739, 0.04568660763316859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 141.2941176470588, 136, 152, 140.0, 148.8, 152.0, 152.0, 0.0820368297108443, 0.06096682364253175, 0.041178643038451146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 221.76470588235296, 136, 562, 140.0, 561.2, 562.0, 562.0, 0.08203841328057138, 0.0871846648489528, 0.04313991470417913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e48abdaa-48b9-4589-a8a1-1df9e248c125", 1, 0, 0.0, 582.0, 582, 582, 582.0, 582.0, 582.0, 582.0, 1.7182130584192439, 0.31041935137457044, 1.1846273625429553], "isController": false}, {"data": ["login", 23, 0, 0.0, 3073.434782608696, 2039, 4635, 2874.0, 4430.6, 4601.799999999999, 4635.0, 0.10197069450909978, 37.26618871367294, 0.20531387161667886], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=84064373-53e2-4bf3-a705-810f0d77dbcb", 1, 0, 0.0, 775.0, 775, 775, 775.0, 775.0, 775.0, 775.0, 1.2903225806451613, 0.2331149193548387, 0.889616935483871], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a5180781-c901-4523-9803-979eb30ebd9e", 3, 0, 0.0, 476.6666666666667, 319, 588, 523.0, 588.0, 588.0, 588.0, 0.07469003634915103, 0.033795296394960914, 0.04789693086192302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 181.21052631578948, 139, 460, 152.0, 421.0, 460.0, 460.0, 0.0986428816181586, 0.07985834849751317, 0.03506446182520481], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1085974-ec92-411c-8c92-6cbe603eeb86", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd4d6c00-335e-433b-87da-0b1a4496d655", 1, 0, 0.0, 750.0, 750, 750, 750.0, 750.0, 750.0, 750.0, 1.3333333333333333, 0.24088541666666666, 0.9192708333333334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40334334-7151-4a90-bad6-a9f305ec5155", 2, 0, 0.0, 304.5, 246, 363, 304.5, 363.0, 363.0, 363.0, 0.026086843100682173, 0.03003553517158621, 0.01621511292342207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1100.1764705882356, 282, 2073, 1381.0, 1973.8, 2073.0, 2073.0, 0.0819794665547888, 51.982347138434385, 0.17326921604723947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35be728e-787e-4044-9c2b-6b75b38f3bdc", 3, 0, 0.0, 482.0, 251, 887, 308.0, 887.0, 887.0, 887.0, 0.01907074611115702, 0.02629056307967122, 0.012229612577792752], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8d36a86-c0e8-4d8f-bfbb-ab79f56361fe", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 1.3884171195652173, 2.594259510869565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, 41.666666666666664, 997.0833333333331, 138, 1795, 1354.0, 1786.0, 1795.0, 1795.0, 0.05866765749821553, 40.948907727386064, 0.09328195737305786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 439.18750000000006, 278, 826, 423.5, 650.3000000000002, 826.0, 826.0, 0.10362560070465408, 0.1605994417170762, 0.23305640470978356], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c372ee51-659c-4540-ba3b-e087a632d228", 3, 0, 0.0, 1844.3333333333333, 249, 3914, 1370.0, 3914.0, 3914.0, 3914.0, 0.020487744913917326, 0.02421582089271934, 0.013138299961073284], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1193.25, 351, 2566, 1190.0, 2004.0, 2478.5, 2566.0, 0.09643124050754975, 0.0301347626586093, 0.04350706358836718], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 178.0, 139, 421, 145.0, 413.8, 421.0, 421.0, 0.09313129321018089, 0.07230408017782598, 0.033105264383306486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 549.7894736842105, 278, 1767, 290.0, 1652.0, 1767.0, 1767.0, 0.09713204846377997, 18.47471930755074, 0.21452823059915135], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e65f5a9-6a6f-447d-bcd6-ec5a521710e7", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 448.66666666666663, 277, 838, 296.0, 756.4000000000001, 838.0, 838.0, 0.06532674259085862, 0.10124369188641856, 0.14692137518237047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 224.61538461538464, 138, 417, 141.0, 417.0, 417.0, 417.0, 0.061643510835032486, 0.04581124193892551, 0.030942152899615917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 183.30769230769232, 136, 431, 140.0, 426.6, 431.0, 431.0, 0.061643510835032486, 0.02361642918108967, 0.034757826947697856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 328.84615384615387, 138, 1485, 141.0, 1061.3999999999996, 1485.0, 1485.0, 0.06156294100376008, 4.276427705276891, 0.03578530930642244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 259.7692307692308, 136, 1108, 140.0, 837.5999999999997, 1108.0, 1108.0, 0.061643803138143764, 1.4095926204069438, 0.03589251187828668], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 143.0, 141, 145, 143.0, 145.0, 145.0, 145.0, 0.02069108214359611, 0.006102252741568385, 0.01279048339540658], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8f9bc30-9d56-4d99-8050-5f41154a0380", 3, 0, 0.0, 615.0, 365, 937, 543.0, 937.0, 937.0, 937.0, 0.09179364787956673, 0.041534235205923746, 0.05886506716235236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69377a50-e301-4cc2-a6dc-01c2db91dc09", 3, 0, 0.0, 434.0, 253, 552, 497.0, 552.0, 552.0, 552.0, 0.021235780875055746, 0.02547325928534519, 0.013617997501256451], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1594.1578947368425, 1086, 2343, 1548.0, 2142.8, 2247.8999999999996, 2343.0, 0.252047331835789, 301.53623470581215, 0.49769502438668484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1193.25, 351, 2566, 1190.0, 2004.0, 2478.5, 2566.0, 0.09435557110675154, 0.029486115970859855, 0.04257057993292891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 190.72727272727275, 136, 429, 140.0, 426.40000000000003, 429.0, 429.0, 0.06345580303318739, 0.01710332191128879, 0.03736704026270703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 238.45454545454547, 136, 418, 140.0, 417.4, 418.0, 418.0, 0.0634561690933844, 0.017103420575951263, 0.03730528690841544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 254.05882352941177, 138, 1525, 140.0, 638.5999999999992, 1525.0, 1525.0, 0.0951661208609735, 5.06123804300669, 0.05546619153581325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 268.94117647058823, 136, 1086, 142.0, 668.3999999999996, 1086.0, 1086.0, 0.0951655881233346, 1.670132017762377, 0.055558816182068566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 157.88235294117644, 137, 414, 141.0, 201.99999999999983, 414.0, 414.0, 0.09516398994620436, 0.07072245737213038, 0.04776786214096586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 189.0909090909091, 136, 418, 139.0, 417.6, 418.0, 418.0, 0.06345543697721373, 0.016979286847418517, 0.03618942890106721], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 155.58823529411762, 136, 420, 139.0, 197.5999999999998, 420.0, 420.0, 0.0951661208609735, 0.0338723164553419, 0.053804283175189635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 166.36363636363635, 138, 418, 140.0, 365.4000000000002, 418.0, 418.0, 0.06335420182344913, 0.047082566003559354, 0.031800839587160984], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 954.2142857142856, 138, 3914, 625.0, 3072.5, 3914.0, 3914.0, 0.07301554187962866, 0.014097866903097944, 0.04968886904141024], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 169.36363636363635, 142, 418, 144.0, 364.6000000000002, 418.0, 418.0, 0.06397134083930399, 0.05035244210593654, 0.02273981256397134], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1480.0000000000002, 1022, 2883, 1329.0, 2178.0, 2741.999999999998, 2883.0, 0.10029827835824802, 0.05191219485339008, 0.046133290143295716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 409.18181818181824, 277, 848, 284.0, 790.4000000000002, 848.0, 848.0, 0.06330279453063856, 0.09810696769543299, 0.14236946855865293], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d51dc7a-05ac-4b0f-9f53-f1410c7e574f", 1, 0, 0.0, 665.0, 665, 665, 665.0, 665.0, 665.0, 665.0, 1.5037593984962407, 0.48020441729323304, 0.8972626879699248], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a62903bc-7662-4dd2-a314-840a42ee24ba", 1, 0, 0.0, 598.0, 598, 598, 598.0, 598.0, 598.0, 598.0, 1.6722408026755853, 0.3021138168896321, 1.1529316471571907], "isController": false}, {"data": ["addBook", 61, 13, 21.311475409836067, 1448.0163934426228, 707, 5649, 1126.0, 2541.6, 3262.2999999999993, 5649.0, 0.2838397468707831, 79.02414546350798, 1.03354492869108], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2539cf8-2347-4156-926a-e6427ab634c0", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.3514865029182879, 1.3413484922178989], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 231.28070175438597, 137, 580, 142.0, 566.2, 570.5, 580.0, 0.2532736733125086, 0.18822389198322173, 0.1224320979391521], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 875.6315789473686, 679, 1255, 830.0, 1113.2, 1244.2, 1255.0, 0.25302745125892256, 74.39847197221582, 0.1272550169905714], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 222.2280701754386, 137, 561, 143.0, 422.2, 426.29999999999995, 561.0, 0.25380032593305013, 0.44910760799871763, 0.12343023663540914], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1361.1403508771932, 943, 1760, 1375.0, 1668.8, 1703.3999999999996, 1760.0, 0.252725668503731, 227.40300076399635, 0.12685643907316185], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 145.33333333333334, 140, 176, 143.0, 159.20000000000002, 176.0, 176.0, 0.06568662226251001, 0.049072525420722816, 0.023349541507376607], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 13, 7.262569832402234, 238.45251396648047, 138, 3418, 148.0, 358.0, 458.0, 3280.399999999998, 0.7268415688408298, 1.5364171989393798, 0.34956171884834186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 172.76923076923077, 141, 493, 146.0, 357.79999999999984, 493.0, 493.0, 0.06325264566354459, 0.048983738292178565, 0.022484338888213114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1085974-ec92-411c-8c92-6cbe603eeb86", 3, 0, 0.0, 376.3333333333333, 257, 574, 298.0, 574.0, 574.0, 574.0, 0.034836731850062704, 0.0290419499570347, 0.022339961505411305], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 148.0625, 139, 188, 145.5, 164.90000000000003, 188.0, 188.0, 0.10370956137337387, 0.0841627397473376, 0.03686550814444149], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c372ee51-659c-4540-ba3b-e087a632d228", 1, 0, 0.0, 743.0, 743, 743, 743.0, 743.0, 743.0, 743.0, 1.3458950201884252, 0.24315486204576042, 0.927931527590848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84064373-53e2-4bf3-a705-810f0d77dbcb", 3, 0, 0.0, 382.6666666666667, 257, 568, 323.0, 568.0, 568.0, 568.0, 0.018544045198019495, 0.02191843363086224, 0.011891851901073702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 579.4615384615385, 278, 1903, 291.0, 1481.3999999999996, 1903.0, 1903.0, 0.061521861556881684, 5.749669024215952, 0.13715326663338176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e48abdaa-48b9-4589-a8a1-1df9e248c125", 3, 0, 0.0, 382.3333333333333, 235, 503, 409.0, 503.0, 503.0, 503.0, 0.026278446418247753, 0.02635543405423871, 0.016851738100243513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 471.05882352941177, 278, 1939, 288.0, 953.3999999999992, 1939.0, 1939.0, 0.09508999988812941, 6.8305078435266084, 0.21242848148262092], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fbb11670-9301-4f23-a32f-d1bddc1185f8", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 1.3646834935897436, 2.549913194444444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69377a50-e301-4cc2-a6dc-01c2db91dc09", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 202.0, 142, 418, 147.5, 417.4, 418.0, 418.0, 0.07111566251351198, 0.05896210690817545, 0.02527939565909996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 168.8235294117647, 138, 436, 146.0, 283.1999999999999, 436.0, 436.0, 0.08214504882798344, 0.06377472052563167, 0.029199997825572237], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd4d6c00-335e-433b-87da-0b1a4496d655", 3, 0, 0.0, 994.6666666666666, 241, 2231, 512.0, 2231.0, 2231.0, 2231.0, 0.030583222044386446, 0.03067282132771961, 0.019612287574036883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 159.4666666666667, 138, 414, 140.0, 256.80000000000007, 414.0, 414.0, 0.06536631281702662, 0.04857789458374732, 0.032810824988234066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 232.0666666666667, 137, 423, 140.0, 421.2, 423.0, 423.0, 0.06537001608102395, 0.01749158633418024, 0.03728133729620898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 249.66666666666669, 136, 561, 140.0, 558.0, 561.0, 561.0, 0.06536944632078966, 0.017619108578650337, 0.038430084653432985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 175.79999999999998, 136, 425, 138.0, 414.8, 425.0, 425.0, 0.06537001608102395, 0.01761926214683849, 0.03849425751646235], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 26.666666666666668, 0.5921539600296077], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.0, 0.22205773501110287], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.666666666666667, 0.14803849000740193], "isController": false}, {"data": ["401/Unauthorized", 17, 56.666666666666664, 1.2583271650629164], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1351, 30, "401/Unauthorized", 17, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
