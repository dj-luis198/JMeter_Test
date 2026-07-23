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

    var data = {"OkPercent": 96.91032403918614, "KoPercent": 3.089675960813866};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6960025789813024, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.40625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.40625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fedf3b6b-0aa3-455b-99eb-835b79cc2332"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/9017a90c-28ae-4689-8d9e-2a3043169692"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d4849480-e99f-4aeb-9c49-ddbdea06784c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9591ffaa-d0eb-4aa2-bacb-878f30992362"], "isController": false}, {"data": [0.6875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.46875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2468db75-9d55-4bf0-a28a-2f480f0ffb14"], "isController": false}, {"data": [0.5681818181818182, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f495618a-d365-46c3-85d4-f74b7004d815"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=700cb47b-5cea-48ed-8c00-bbb86fd93807"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/340b8f4f-c30a-45d5-aa22-c9c12c2f541c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d40e47ae-e1b8-4c93-b44e-506d3793bc1e"], "isController": false}, {"data": [0.47058823529411764, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ee9112d6-50d8-442b-bc47-f28e2f6b7224"], "isController": false}, {"data": [0.029411764705882353, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.12, 500, 1500, "register"], "isController": true}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d4849480-e99f-4aeb-9c49-ddbdea06784c"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a9842d3-b3d4-465c-ad76-043924464404"], "isController": false}, {"data": [0.16379310344827586, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.12, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee9112d6-50d8-442b-bc47-f28e2f6b7224"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab38ce8b-ccb6-47dc-a693-f9028e6afaee"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9591ffaa-d0eb-4aa2-bacb-878f30992362"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.375, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9017a90c-28ae-4689-8d9e-2a3043169692"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.24545454545454545, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fedf3b6b-0aa3-455b-99eb-835b79cc2332"], "isController": false}, {"data": [0.9137931034482759, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.28448275862068967, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8898809523809523, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2468db75-9d55-4bf0-a28a-2f480f0ffb14"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d40e47ae-e1b8-4c93-b44e-506d3793bc1e"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5a9842d3-b3d4-465c-ad76-043924464404"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=340b8f4f-c30a-45d5-aa22-c9c12c2f541c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ab38ce8b-ccb6-47dc-a693-f9028e6afaee"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f495618a-d365-46c3-85d4-f74b7004d815"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ce164b89-dcd0-453a-9e12-54851583738d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/700cb47b-5cea-48ed-8c00-bbb86fd93807"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1327, 41, 3.089675960813866, 509.16578749058044, 139, 2694, 162.0, 1470.2, 1740.3999999999996, 2275.32, 5.197521483349914, 743.692031399326, 3.8126956230856908], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 2455.655172413794, 1702, 3282, 2421.0, 3023.5, 3097.1499999999996, 3282.0, 0.256286758370193, 308.39858766802246, 1.2601599886659391], "isController": true}, {"data": ["deleteBook", 16, 4, 25.0, 608.125, 144, 1422, 551.0, 1158.8000000000002, 1422.0, 1422.0, 0.0909008271975275, 0.01901904514362331, 0.06069671933233343], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 608.125, 144, 1422, 551.0, 1158.8000000000002, 1422.0, 1422.0, 0.09064077361900284, 0.018964634519405624, 0.06052307515819648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 183.5, 142, 464, 148.0, 442.40000000000003, 464.0, 464.0, 0.11172074778420517, 0.039216213008019064, 0.06319447246083566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 164.50000000000006, 142, 440, 148.0, 182.60000000000042, 440.0, 440.0, 0.11172421498221723, 0.08302942148580793, 0.056080318848495764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 286.88888888888886, 140, 1171, 153.5, 514.000000000001, 1171.0, 1171.0, 0.11151794509599837, 1.8500531839922185, 0.06513683793964402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fedf3b6b-0aa3-455b-99eb-835b79cc2332", 3, 0, 0.0, 455.6666666666667, 262, 559, 546.0, 559.0, 559.0, 559.0, 0.07981058288329032, 0.03751513075633829, 0.05118061467450584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9017a90c-28ae-4689-8d9e-2a3043169692", 3, 0, 0.0, 915.3333333333334, 261, 1922, 563.0, 1922.0, 1922.0, 1922.0, 0.03187962254526906, 0.02657672960235484, 0.02044363815565757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 306.44444444444446, 142, 1742, 150.5, 595.4000000000018, 1742.0, 1742.0, 0.11151587242584195, 5.602952624727405, 0.06502672508859317], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4849480-e99f-4aeb-9c49-ddbdea06784c", 3, 0, 0.0, 430.33333333333337, 244, 787, 260.0, 787.0, 787.0, 787.0, 0.03905995703404726, 0.02556952265477508, 0.0250482146344639], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9591ffaa-d0eb-4aa2-bacb-878f30992362", 1, 0, 0.0, 1460.0, 1460, 1460, 1460.0, 1460.0, 1460.0, 1460.0, 0.684931506849315, 0.12374250856164384, 0.4722281678082192], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 309.0625, 140, 1167, 259.5, 741.4000000000004, 1167.0, 1167.0, 0.09083580293172554, 0.155902269191902, 0.05870175057623963], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 160.42857142857142, 140, 440, 147.0, 155.6, 411.59999999999957, 440.0, 0.13017766151328433, 0.09674335977696226, 0.06534308400178529], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 1138.888888888889, 870, 1319, 1165.0, 1319.0, 1319.0, 1319.0, 0.04361838757360603, 12.825254213415077, 0.024876111663072187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 162.00000000000003, 140, 437, 147.0, 163.4, 409.6999999999996, 437.0, 0.12994165001144722, 0.04406317484577164, 0.07358767735488303], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1611.2222222222224, 1237, 2014, 1534.0, 2014.0, 2014.0, 2014.0, 0.04337788402681717, 39.03149629751685, 0.024696588269174227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 333.77777777777777, 141, 443, 421.0, 443.0, 443.0, 443.0, 0.0437135113606559, 0.07735242439991064, 0.024204649356925678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 152.55555555555554, 140, 167, 153.0, 167.0, 167.0, 167.0, 0.045774737431020014, 0.034018139829107646, 0.022976772499554966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 184.0, 139, 476, 150.0, 476.0, 476.0, 476.0, 0.045698501596908754, 0.019854253514976414, 0.02563598668142559], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 345.77777777777777, 146, 1653, 147.0, 1653.0, 1653.0, 1653.0, 0.045427243222507685, 4.552607310820769, 0.026272483330725474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 300.22222222222223, 143, 915, 154.0, 915.0, 915.0, 915.0, 0.04559709394521256, 1.5005975910801952, 0.026415243551810963], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 178.77777777777777, 142, 437, 146.0, 437.0, 437.0, 437.0, 0.043772828746103, 0.032530393238070686, 0.024579469266610574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 263.85714285714283, 139, 1787, 146.0, 439.6, 1652.399999999998, 1787.0, 0.12995853703818305, 5.601784657543783, 0.07586958119314313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 970.6470588235294, 139, 2331, 1260.0, 1962.9999999999998, 2331.0, 2331.0, 0.09068311053737745, 43.20981975564902, 0.04918600239510098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 258.5238095238096, 140, 1224, 147.0, 545.6000000000001, 1158.3999999999992, 1224.0, 0.13017685455526007, 1.8560977202003486, 0.07612416043677435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 649.5294117647057, 140, 1207, 893.0, 1175.8, 1207.0, 1207.0, 0.09068117565477143, 14.127354126660265, 0.049273508761401824], "isController": false}, {"data": ["deleteBooks", 16, 4, 25.0, 538.9375000000001, 154, 1460, 537.0, 1049.1000000000004, 1460.0, 1460.0, 0.09058637694123775, 0.018953253183261902, 0.06084060619271119], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 538.6666666666666, 287, 1807, 322.0, 1807.0, 1807.0, 1807.0, 0.04539287533603337, 6.096495638501228, 0.10079917466926247], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2468db75-9d55-4bf0-a28a-2f480f0ffb14", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 0.6103515625, 2.3292335304054057], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 868.7272727272727, 256, 1624, 804.5, 1480.2, 1605.8499999999997, 1624.0, 0.09682587187296446, 0.05947604825009243, 0.04377966667693608], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 147.58823529411765, 142, 160, 148.0, 153.6, 160.0, 160.0, 0.09067924085473186, 0.06738955301801851, 0.045516728319660325], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f495618a-d365-46c3-85d4-f74b7004d815", 1, 0, 0.0, 542.0, 542, 542, 542.0, 542.0, 542.0, 542.0, 1.8450184501845017, 0.33332852859778594, 1.2720537361623616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 246.99999999999997, 139, 440, 149.0, 438.4, 440.0, 440.0, 0.09068069194702115, 0.09636907174976396, 0.04768445852958591], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=700cb47b-5cea-48ed-8c00-bbb86fd93807", 1, 0, 0.0, 809.0, 809, 809, 809.0, 809.0, 809.0, 809.0, 1.2360939431396785, 0.22331775339925833, 0.8522288318912237], "isController": false}, {"data": ["login", 22, 0, 0.0, 3599.7727272727275, 2040, 5116, 3751.0, 4939.9, 5096.65, 5116.0, 0.09813017413645447, 48.15595857150344, 0.21462490856051955], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 167.7142857142857, 145, 440, 155.0, 165.4, 412.5999999999996, 440.0, 0.12300339137921945, 0.0995798939974345, 0.043723861779331914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/340b8f4f-c30a-45d5-aa22-c9c12c2f541c", 3, 0, 0.0, 643.6666666666666, 256, 1167, 508.0, 1167.0, 1167.0, 1167.0, 0.044670776378093455, 0.028719004995681825, 0.028646298653920606], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d40e47ae-e1b8-4c93-b44e-506d3793bc1e", 1, 0, 0.0, 809.0, 809, 809, 809.0, 809.0, 809.0, 809.0, 1.2360939431396785, 0.22331775339925833, 0.8522288318912237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1137.7058823529412, 285, 2483, 1403.0, 2111.7999999999997, 2483.0, 2483.0, 0.09060819417869002, 57.45373568923521, 0.19150662272613406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee9112d6-50d8-442b-bc47-f28e2f6b7224", 3, 0, 0.0, 751.3333333333334, 280, 1339, 635.0, 1339.0, 1339.0, 1339.0, 0.024164511997680205, 0.028561635111841416, 0.015496122602679038], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 8, 47.05882352941177, 1036.0, 139, 2277, 1380.0, 2185.0, 2277.0, 2277.0, 0.0818795696024506, 51.86959730303147, 0.12327559970764176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 538.5, 293, 1890, 456.0, 984.6000000000014, 1890.0, 1890.0, 0.11141716443316517, 7.568285326591563, 0.24899608492463865], "isController": false}, {"data": ["register", 25, 11, 44.0, 1334.84, 211, 2509, 1368.0, 2233.0, 2436.1, 2509.0, 0.10491021783557632, 0.032391029756734184, 0.047332539687535403], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 490.4761904761905, 283, 1944, 301.0, 844.0000000000001, 1837.2999999999984, 1944.0, 0.1298259713764644, 7.587671169361071, 0.2903998813792464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 197.53846153846152, 148, 461, 154.0, 444.59999999999997, 461.0, 461.0, 0.07259041694818719, 0.05635681784551643, 0.025803624774550917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d4849480-e99f-4aeb-9c49-ddbdea06784c", 1, 0, 0.0, 717.0, 717, 717, 717.0, 717.0, 717.0, 717.0, 1.3947001394700138, 0.2519721931659693, 0.9615803695955369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 433.40000000000003, 295, 607, 324.5, 603.5, 606.85, 607.0, 0.09416373189702255, 0.1459353930864988, 0.21177643999887005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 145.66666666666669, 141, 153, 145.5, 153.0, 153.0, 153.0, 0.039677028984069676, 0.029486542047731466, 0.019916008689269345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 145.16666666666666, 140, 150, 144.5, 150.0, 150.0, 150.0, 0.039676241866370414, 0.010616494405649898, 0.02262785668941438], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 149.16666666666669, 142, 158, 148.0, 158.0, 158.0, 158.0, 0.039675454779900414, 0.010693774921145033, 0.023324827907714892], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 155.5, 154, 157, 155.5, 157.0, 157.0, 157.0, 0.02611937861998263, 0.00770317611644019, 0.016146061197704106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 289.3333333333333, 140, 448, 285.0, 448.0, 448.0, 448.0, 0.039603437578381806, 0.01067436403479822, 0.0233211649021135], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a9842d3-b3d4-465c-ad76-043924464404", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1724.7758620689658, 1125, 2694, 1587.0, 2321.5, 2449.2499999999995, 2694.0, 0.2527651637308138, 302.39501121100665, 0.49911246197627496], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 11, 44.0, 1334.84, 211, 2509, 1368.0, 2233.0, 2436.1, 2509.0, 0.100637640087595, 0.03107187137704496, 0.045404872773895405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 175.88888888888889, 140, 421, 147.0, 421.0, 421.0, 421.0, 0.046916540687066674, 0.012645473857060939, 0.027627611361622267], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee9112d6-50d8-442b-bc47-f28e2f6b7224", 1, 0, 0.0, 582.0, 582, 582, 582.0, 582.0, 582.0, 582.0, 1.7182130584192439, 0.31041935137457044, 1.1846273625429553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 145.22222222222223, 140, 157, 144.0, 157.0, 157.0, 157.0, 0.046916051545101964, 0.012645342018015765, 0.02758150686538221], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab38ce8b-ccb6-47dc-a693-f9028e6afaee", 1, 0, 0.0, 873.0, 873, 873, 873.0, 873.0, 873.0, 873.0, 1.1454753722794961, 0.20694623424971365, 0.7897515750286369], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9591ffaa-d0eb-4aa2-bacb-878f30992362", 3, 0, 0.0, 638.6666666666667, 264, 1299, 353.0, 1299.0, 1299.0, 1299.0, 0.0343800137520055, 0.027944952584231034, 0.02204707913133165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 188.9230769230769, 141, 427, 145.0, 425.0, 427.0, 427.0, 0.06929933046185338, 0.01867833516354642, 0.04074042669730052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 169.30769230769232, 142, 419, 149.0, 314.19999999999993, 419.0, 419.0, 0.06929711404172753, 0.01867773776905937, 0.04080679664761884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 147.84615384615387, 141, 154, 149.0, 153.6, 154.0, 154.0, 0.06929674465215699, 0.05149885027372214, 0.034783717530477244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 176.55555555555554, 141, 418, 146.0, 418.0, 418.0, 418.0, 0.04691360598826117, 0.012553054727327696, 0.0267554159151802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 189.30769230769232, 142, 427, 147.0, 426.6, 427.0, 427.0, 0.06929674465215699, 0.018542293002627948, 0.03952079968443329], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 179.88888888888889, 144, 441, 147.0, 441.0, 441.0, 441.0, 0.04691678526187386, 0.0348668687346543, 0.023550026977151525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 152.44444444444443, 145, 164, 151.0, 164.0, 164.0, 164.0, 0.04750769360704803, 0.03739375102273507, 0.016887500461880353], "isController": false}, {"data": ["deleteAccount", 16, 4, 25.0, 609.3749999999999, 139, 1299, 554.5, 1035.1000000000004, 1299.0, 1299.0, 0.09243158618378865, 0.018707467027920116, 0.0628922926499558], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9017a90c-28ae-4689-8d9e-2a3043169692", 1, 0, 0.0, 653.0, 653, 653, 653.0, 653.0, 653.0, 653.0, 1.5313935681470139, 0.2766677833078101, 1.055824081163859], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1653.3181818181815, 1108, 2348, 1603.5, 2281.7, 2342.15, 2348.0, 0.09849570200573066, 0.05097922076468481, 0.0453041754342765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 360.3333333333333, 287, 863, 298.0, 863.0, 863.0, 863.0, 0.04687817404303416, 0.07265201387333517, 0.10543011212998797], "isController": false}, {"data": ["addBook", 55, 14, 25.454545454545453, 1413.0909090909092, 714, 3758, 1154.0, 2612.6, 2892.799999999999, 3758.0, 0.2667028736022345, 70.66327678727293, 0.9713108400776832], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fedf3b6b-0aa3-455b-99eb-835b79cc2332", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 0.72265625, 2.7578125], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 265.0344827586207, 141, 626, 153.5, 582.7, 595.15, 626.0, 0.25435919026067433, 0.18903060916833317, 0.12295683513577518], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 937.7931034482758, 693, 1400, 870.0, 1299.9, 1314.4, 1400.0, 0.253669459946467, 74.58724384304858, 0.1275779022191704], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 215.1206896551724, 141, 466, 152.0, 443.1, 448.29999999999995, 466.0, 0.25456125489920695, 0.45045409558336225, 0.12380029779277836], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1457.8965517241381, 975, 2098, 1416.0, 1762.7, 1985.85, 2098.0, 0.2534499785878467, 228.05473625088487, 0.1272200087833527], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 155.35, 144, 165, 157.5, 161.9, 164.85, 165.0, 0.09734681262198773, 0.07272491372638731, 0.0346037497992222], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 14, 8.333333333333334, 226.47023809523816, 141, 1569, 157.5, 421.0999999999999, 489.29999999999956, 1396.5000000000005, 0.7151309796443074, 1.5996749053941308, 0.33937461157320303], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 152.5, 145, 159, 154.5, 159.0, 159.0, 159.0, 0.03797901026699244, 0.029411479630590827, 0.01350035130584497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 158.83333333333334, 147, 187, 156.0, 182.5, 187.0, 187.0, 0.10694615261215978, 0.0867893093952195, 0.03801601518635367], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2468db75-9d55-4bf0-a28a-2f480f0ffb14", 3, 0, 0.0, 354.3333333333333, 240, 513, 310.0, 513.0, 513.0, 513.0, 0.08337965536409116, 0.03772712270705948, 0.053469375347415235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 439.3333333333333, 293, 592, 437.5, 592.0, 592.0, 592.0, 0.03956661369136722, 0.061320523367382605, 0.08898624153439327], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d40e47ae-e1b8-4c93-b44e-506d3793bc1e", 3, 0, 0.0, 552.3333333333334, 248, 801, 608.0, 801.0, 801.0, 801.0, 0.02058389653161343, 0.02432946884970325, 0.013199959689869293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 362.5384615384616, 290, 577, 301.0, 577.0, 577.0, 577.0, 0.06924138077965795, 0.10731061650128629, 0.15572548821831275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a9842d3-b3d4-465c-ad76-043924464404", 3, 0, 0.0, 411.0, 284, 544, 405.0, 544.0, 544.0, 544.0, 0.024309016214113816, 0.028732434203596113, 0.015588789694597725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 188.77777777777777, 149, 439, 156.0, 439.0, 439.0, 439.0, 0.04805279400301131, 0.0398406465903873, 0.017081266618257925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=340b8f4f-c30a-45d5-aa22-c9c12c2f541c", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 151.76470588235293, 142, 162, 152.0, 162.0, 162.0, 162.0, 0.09380811274631527, 0.07282954065753969, 0.033345852577791754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab38ce8b-ccb6-47dc-a693-f9028e6afaee", 3, 0, 0.0, 524.3333333333334, 259, 922, 392.0, 922.0, 922.0, 922.0, 0.025178980587005968, 0.02525274713169446, 0.01614667700403703], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f495618a-d365-46c3-85d4-f74b7004d815", 3, 0, 0.0, 448.0, 262, 808, 274.0, 808.0, 808.0, 808.0, 0.024100450678427685, 0.024171057467524643, 0.015455041613444838], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce164b89-dcd0-453a-9e12-54851583738d", 1, 0, 0.0, 729.0, 729, 729, 729.0, 729.0, 729.0, 729.0, 1.371742112482853, 0.4380465534979424, 0.8184906550068587], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/700cb47b-5cea-48ed-8c00-bbb86fd93807", 3, 0, 0.0, 563.0, 257, 920, 512.0, 920.0, 920.0, 920.0, 0.0179972644158088, 0.024810681901350995, 0.01154121448539822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 150.35000000000002, 142, 164, 150.5, 156.8, 163.65, 164.0, 0.0942413804477408, 0.07003680714915111, 0.047304755420057396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 189.10000000000002, 141, 444, 146.0, 437.70000000000005, 443.75, 444.0, 0.09424182452172274, 0.025217050702101593, 0.053747290547545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 219.65000000000003, 141, 464, 149.0, 441.70000000000005, 462.95, 464.0, 0.09422850412249704, 0.025397526501766785, 0.05539605418138987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 263.15, 143, 452, 155.5, 443.9, 451.6, 452.0, 0.09423605188637017, 0.02539956085999821, 0.05549251883543087], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 11, 26.829268292682926, 0.8289374529012811], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 9.75609756097561, 0.30143180105501133], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 9.75609756097561, 0.30143180105501133], "isController": false}, {"data": ["401/Unauthorized", 22, 53.65853658536585, 1.6578749058025621], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1327, 41, "401/Unauthorized", 22, "406/Not Acceptable", 11, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 11, "406/Not Acceptable", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
