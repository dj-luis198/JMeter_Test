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

    var data = {"OkPercent": 98.72, "KoPercent": 1.28};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7312456985547143, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3c3b5bbc-173e-4e78-9535-fbd4f0f4c808"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d9d970e5-cf05-449c-a8e1-fd43b391262b"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/40b72038-4b15-4745-a928-98e3b684a00a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/06106ce5-925b-4d75-b56a-09c66fb1fd8f"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae3ccf8b-7a84-47d4-8fe7-1f5ac8516736"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.46875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/542306fe-4112-4292-9251-2ba9f9ca19c0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6cbfc23-fc48-46f1-aa86-e9a806b2c177"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1dca9b92-c4f8-4f2d-8463-29fa5951a093"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5fa596b6-a1c8-40a5-bd0a-57d68919472f"], "isController": false}, {"data": [0.40625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5855cf6a-670b-44d8-8b15-bc72f9497e47"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d0ff2ea6-0aa0-4657-a76f-352e86966621"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/da41a890-a762-4524-8e66-b43f76893223"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e5030c38-d699-4f7d-8888-79ebc6dd66c9"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/441c7645-4e12-4d3f-8e2c-6af136fd8408"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.18269230769230768, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c3b5bbc-173e-4e78-9535-fbd4f0f4c808"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.14285714285714285, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=542306fe-4112-4292-9251-2ba9f9ca19c0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d9d970e5-cf05-449c-a8e1-fd43b391262b"], "isController": false}, {"data": [0.2711864406779661, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7e4a3705-b803-45b0-b906-f89a87e9a503"], "isController": false}, {"data": [0.8942307692307693, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=574dcae1-243e-4739-96a1-69b7ed738fc6"], "isController": false}, {"data": [0.9807692307692307, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3173076923076923, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ae3ccf8b-7a84-47d4-8fe7-1f5ac8516736"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=40b72038-4b15-4745-a928-98e3b684a00a"], "isController": false}, {"data": [0.9294117647058824, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/574dcae1-243e-4739-96a1-69b7ed738fc6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b6cbfc23-fc48-46f1-aa86-e9a806b2c177"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1dca9b92-c4f8-4f2d-8463-29fa5951a093"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5855cf6a-670b-44d8-8b15-bc72f9497e47"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5fa596b6-a1c8-40a5-bd0a-57d68919472f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da41a890-a762-4524-8e66-b43f76893223"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e5030c38-d699-4f7d-8888-79ebc6dd66c9"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1250, 16, 1.28, 485.8256000000004, 136, 2550, 160.5, 1399.1000000000008, 1663.0, 2215.0, 4.875708440436395, 684.4660409040247, 3.559050040127081], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 52, 0, 0.0, 2385.846153846154, 1673, 3092, 2385.0, 2836.3, 2968.9499999999994, 3092.0, 0.22645321999059348, 272.4992424908439, 1.113468713527967], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3c3b5bbc-173e-4e78-9535-fbd4f0f4c808", 3, 0, 0.0, 387.0, 234, 664, 263.0, 664.0, 664.0, 664.0, 0.07146770850703958, 0.03233727696119304, 0.045830529218381495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d9d970e5-cf05-449c-a8e1-fd43b391262b", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 660.0, 472, 969, 587.0, 948.6, 969.0, 969.0, 0.07265045630075054, 0.013125326577772314, 0.049379607016916384], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 660.0, 472, 969, 587.0, 948.6, 969.0, 969.0, 0.07262894431036024, 0.013121440134195942, 0.04936498558594798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 190.7058823529412, 139, 419, 142.0, 414.2, 419.0, 419.0, 0.09618866558030056, 0.03423626906798841, 0.05438240157636249], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 143.47058823529412, 138, 151, 143.0, 147.8, 151.0, 151.0, 0.09618267919681804, 0.07147951061404154, 0.04827919639371531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 250.2352941176471, 136, 1151, 143.0, 566.1999999999995, 1151.0, 1151.0, 0.0961902983596725, 1.6881154234070603, 0.05615705435600595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 243.82352941176472, 139, 1294, 142.0, 604.3999999999994, 1294.0, 1294.0, 0.09618866558030056, 5.115620234771071, 0.05606216687601847], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 353.0769230769231, 234, 597, 283.0, 561.8, 597.0, 597.0, 0.07316029984467506, 0.1382197672095536, 0.04729699071989735], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/40b72038-4b15-4745-a928-98e3b684a00a", 3, 0, 0.0, 866.3333333333334, 597, 1240, 762.0, 1240.0, 1240.0, 1240.0, 0.022019641520236048, 0.026026470820305046, 0.014120668553015957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 13, 0, 0.0, 165.30769230769232, 139, 423, 144.0, 312.9999999999999, 423.0, 423.0, 0.10397504598896265, 0.07727051757578181, 0.05219059925617852], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 13, 0, 0.0, 205.53846153846152, 139, 434, 141.0, 426.8, 434.0, 434.0, 0.10397421439483008, 0.06385916292759396, 0.057282668898113266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1063.2, 832, 1147, 1113.0, 1147.0, 1147.0, 1147.0, 0.08861320336730173, 26.055224025254763, 0.05053721754541427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/06106ce5-925b-4d75-b56a-09c66fb1fd8f", 2, 0, 0.0, 245.0, 243, 247, 245.0, 247.0, 247.0, 247.0, 0.024149922720247293, 0.02780542860075348, 0.015011158018981839], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1354.2, 1231, 1501, 1365.0, 1501.0, 1501.0, 1501.0, 0.08826281134706702, 79.41903279956398, 0.05025119044466804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 364.8, 142, 429, 419.0, 429.0, 429.0, 429.0, 0.09021037058420235, 0.15963006982282682, 0.04995046886840111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 163.57142857142856, 139, 431, 143.5, 289.5, 431.0, 431.0, 0.06902978635281125, 0.051300456459462254, 0.03464971697787595], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae3ccf8b-7a84-47d4-8fe7-1f5ac8516736", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.3542432598039216, 1.3518688725490196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 142.21428571428572, 138, 146, 142.5, 146.0, 146.0, 146.0, 0.06902910562932356, 0.018470678654721344, 0.039368161804223596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 169.9285714285714, 138, 550, 141.0, 346.5, 550.0, 550.0, 0.06889085719909459, 0.01856823885444346, 0.04050028909556146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 172.50000000000003, 137, 579, 141.0, 362.0, 579.0, 579.0, 0.06888102770493335, 0.018565589498595318, 0.04056177705671369], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 199.6, 140, 432, 142.0, 432.0, 432.0, 432.0, 0.09021199819576003, 0.0670423150654037, 0.050656151330626974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 1019.375, 140, 1784, 1408.0, 1734.3, 1784.0, 1784.0, 0.10957778310447557, 61.635001647947135, 0.05853422593569155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 13, 0, 0.0, 513.9999999999999, 139, 1647, 144.0, 1600.6, 1647.0, 1647.0, 0.10374520178441747, 21.56384388691374, 0.058933384607404216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 720.8124999999999, 140, 1163, 960.5, 1160.2, 1163.0, 1163.0, 0.10957628221371483, 20.147991115760494, 0.05864043227843334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 13, 0, 0.0, 347.0, 138, 1145, 145.0, 1016.9999999999999, 1145.0, 1145.0, 0.10395426012554476, 7.075246266642677, 0.059153659889648554], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 538.0833333333334, 290, 917, 497.5, 830.6000000000004, 917.0, 917.0, 0.06716405379840709, 0.012134130813188782, 0.04630646677897989], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 339.14285714285717, 280, 1011, 288.0, 653.0, 1011.0, 1011.0, 0.06883293754394246, 0.10667760925999675, 0.15480688980830026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 709.4285714285713, 213, 1810, 553.0, 1509.2000000000003, 1784.1999999999996, 1810.0, 0.09959498041298719, 0.06117699480446185, 0.045031714776575256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 144.0, 140, 159, 143.0, 152.70000000000002, 159.0, 159.0, 0.10956502684343158, 0.08142479045688615, 0.05499650761476936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 237.4375, 137, 560, 145.5, 460.6000000000001, 560.0, 560.0, 0.10957628221371483, 0.1321817408246985, 0.05674103871467021], "isController": false}, {"data": ["login", 21, 0, 0.0, 3152.4761904761904, 1915, 4491, 3148.0, 4385.8, 4480.5, 4491.0, 0.0961551669665792, 27.521514539748715, 0.18304091144795945], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/542306fe-4112-4292-9251-2ba9f9ca19c0", 3, 0, 0.0, 661.6666666666666, 481, 942, 562.0, 942.0, 942.0, 942.0, 0.031007751937984496, 0.025849886950904392, 0.01988452842377261], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 150.07692307692307, 142, 162, 149.0, 161.2, 162.0, 162.0, 0.1029287179040546, 0.08332803431880982, 0.03658794269245691], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6cbfc23-fc48-46f1-aa86-e9a806b2c177", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1dca9b92-c4f8-4f2d-8463-29fa5951a093", 3, 0, 0.0, 668.3333333333334, 243, 1265, 497.0, 1265.0, 1265.0, 1265.0, 0.02156969888700354, 0.02549465386025711, 0.013832131122199534], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5fa596b6-a1c8-40a5-bd0a-57d68919472f", 3, 0, 0.0, 392.0, 279, 467, 430.0, 467.0, 467.0, 467.0, 0.07539582809751194, 0.03411464878110078, 0.048349538200552905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1165.25, 283, 1927, 1553.0, 1880.1000000000001, 1927.0, 1927.0, 0.10945559523320883, 81.90545356089835, 0.22866492392836132], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5855cf6a-670b-44d8-8b15-bc72f9497e47", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d0ff2ea6-0aa0-4657-a76f-352e86966621", 1, 0, 0.0, 323.0, 323, 323, 323.0, 323.0, 323.0, 323.0, 3.0959752321981426, 0.9886561532507739, 1.8473055340557274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 454.05882352941177, 280, 1441, 295.0, 744.9999999999993, 1441.0, 1441.0, 0.09610601058296775, 6.9034899555085705, 0.21469822182680565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 1555.0, 1372, 1716, 1533.0, 1716.0, 1716.0, 1716.0, 0.08804211934989699, 105.32898313553204, 0.1985246616981564], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 1430.3809523809525, 330, 2297, 1420.0, 2209.4, 2289.6, 2297.0, 0.09741886400326584, 0.030769574233174373, 0.043952651532723465], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/da41a890-a762-4524-8e66-b43f76893223", 3, 0, 0.0, 513.3333333333334, 266, 735, 539.0, 735.0, 735.0, 735.0, 0.027950918187662464, 0.02803280564329038, 0.017924254176333025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 0, 0.0, 681.0, 282, 1791, 293.0, 1743.3999999999999, 1791.0, 1791.0, 0.10362694300518135, 28.732889722000795, 0.22694082552809883], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 169.9375, 140, 431, 150.5, 261.60000000000014, 431.0, 431.0, 0.13861694938748637, 0.10761765113579262, 0.04927399372758304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e5030c38-d699-4f7d-8888-79ebc6dd66c9", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 543.1875, 281, 1430, 562.5, 1019.8000000000004, 1430.0, 1430.0, 0.11137485295038946, 8.489511458123056, 0.2487036358668792], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/441c7645-4e12-4d3f-8e2c-6af136fd8408", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.6680668148535566, 1.2482838650627615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 167.54545454545453, 139, 419, 142.0, 364.6000000000002, 419.0, 419.0, 0.06005415793151642, 0.04463009197840234, 0.030144372242968204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 216.27272727272728, 138, 421, 142.0, 420.6, 421.0, 421.0, 0.06005448579711411, 0.016069266707430925, 0.03424982393116664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 193.54545454545453, 138, 434, 140.0, 433.6, 434.0, 434.0, 0.06005448579711411, 0.016186560625003413, 0.03530546918931904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 166.72727272727272, 138, 414, 143.0, 360.20000000000016, 414.0, 414.0, 0.06005383006949866, 0.01618638388591956, 0.035363730011628604], "isController": false}, {"data": ["https://demoqa.com/books", 52, 0, 0.0, 1670.403846153846, 1096, 2501, 1659.0, 2251.1, 2359.4499999999994, 2501.0, 0.23737030223630212, 283.97740474375416, 0.46871362414238565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c3b5bbc-173e-4e78-9535-fbd4f0f4c808", 1, 0, 0.0, 629.0, 629, 629, 629.0, 629.0, 629.0, 629.0, 1.589825119236884, 0.28722426470588236, 1.0961098966613672], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 1430.3809523809525, 330, 2297, 1420.0, 2209.4, 2289.6, 2297.0, 0.09669576748812024, 0.030541185490109406, 0.04362641072217925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 143.125, 138, 148, 144.0, 148.0, 148.0, 148.0, 0.04158847167565151, 0.011209392756327947, 0.024490086348064318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 211.25, 138, 421, 143.0, 421.0, 421.0, 421.0, 0.04152974827781325, 0.011193564965504351, 0.024414949671136305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 262.5625, 136, 1509, 142.0, 756.5000000000007, 1509.0, 1509.0, 0.1277200376774111, 7.21494265819324, 0.07439941647907786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 278.875, 137, 1099, 143.5, 716.8000000000004, 1099.0, 1099.0, 0.12744028228022525, 2.3741819677974334, 0.07436090689690877], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 176.125, 138, 421, 141.0, 421.0, 421.0, 421.0, 0.04158825547665339, 0.011128107422463897, 0.023718301951528888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 179.99999999999997, 139, 435, 145.0, 434.3, 435.0, 435.0, 0.12772309632716272, 0.09491921514157307, 0.06411100733609534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 142.375, 139, 147, 142.5, 147.0, 147.0, 147.0, 0.04158847167565151, 0.03090705756364336, 0.020875463321567263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 194.5, 138, 434, 140.5, 422.8, 434.0, 434.0, 0.12744434266597635, 0.04606478254809033, 0.07201414333505914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 150.25, 142, 181, 146.5, 181.0, 181.0, 181.0, 0.04194520907065146, 0.03301546729584481, 0.014910211036833137], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 594.5, 467, 942, 525.0, 888.0000000000002, 942.0, 942.0, 0.06762125335993102, 0.012216730343346914, 0.046027357023312426], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1704.7619047619046, 918, 2550, 1611.0, 2298.8, 2525.7, 2550.0, 0.09772350762243359, 0.05057954984364239, 0.04494899618180295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 356.24999999999994, 281, 567, 289.5, 567.0, 567.0, 567.0, 0.04149872650783029, 0.06431492086711589, 0.09333160854251286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=542306fe-4112-4292-9251-2ba9f9ca19c0", 1, 0, 0.0, 917.0, 917, 917, 917.0, 917.0, 917.0, 917.0, 1.0905125408942202, 0.19701642584514723, 0.7518572791712105], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9d970e5-cf05-449c-a8e1-fd43b391262b", 3, 0, 0.0, 435.0, 357, 525, 423.0, 525.0, 525.0, 525.0, 0.05074682409459208, 0.0326253182248761, 0.03254272248253463], "isController": false}, {"data": ["addBook", 59, 11, 18.64406779661017, 1374.0169491525432, 707, 2655, 1126.0, 2414.0, 2521.0, 2655.0, 0.27455652141540865, 90.16646388796465, 0.9964398540894961], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7e4a3705-b803-45b0-b906-f89a87e9a503", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 1.3531183792372883, 2.5283037605932206], "isController": false}, {"data": ["https://demoqa.com/books-0", 52, 0, 0.0, 269.90384615384613, 137, 716, 147.5, 577.4000000000001, 586.35, 716.0, 0.23841071747871498, 0.1771782773450216, 0.11524736831246477], "isController": false}, {"data": ["https://demoqa.com/books-3", 52, 0, 0.0, 916.1153846153845, 681, 1305, 838.5, 1242.0, 1293.35, 1305.0, 0.23815194093831865, 70.02457802452965, 0.11977368123362704], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=574dcae1-243e-4739-96a1-69b7ed738fc6", 1, 0, 0.0, 609.0, 609, 609, 609.0, 609.0, 609.0, 609.0, 1.6420361247947455, 0.29665691707717573, 1.1321069376026274], "isController": false}, {"data": ["https://demoqa.com/books-1", 52, 0, 0.0, 237.59615384615387, 139, 608, 147.0, 433.0, 478.0499999999993, 608.0, 0.23890690900403386, 0.4227532413235443, 0.11618714910547741], "isController": false}, {"data": ["https://demoqa.com/books-2", 52, 0, 0.0, 1398.8076923076924, 952, 1918, 1381.5, 1719.9, 1730.55, 1918.0, 0.23801568157163586, 214.1669286650982, 0.11947271516388752], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae3ccf8b-7a84-47d4-8fe7-1f5ac8516736", 3, 0, 0.0, 353.0, 265, 511, 283.0, 511.0, 511.0, 511.0, 0.04874482086278333, 0.04063655150702738, 0.031258885774636445], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 152.8125, 142, 191, 148.0, 181.20000000000002, 191.0, 191.0, 0.10719118888427372, 0.0800793549770209, 0.03810311792370667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=40b72038-4b15-4745-a928-98e3b684a00a", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 0.3642420614919355, 1.3900264616935485], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 11, 6.470588235294118, 208.3823529411766, 139, 578, 150.5, 373.9, 432.0999999999998, 534.6899999999995, 0.7210936870368564, 1.5401530547861535, 0.3483560190644446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/574dcae1-243e-4739-96a1-69b7ed738fc6", 3, 0, 0.0, 496.6666666666667, 345, 696, 449.0, 696.0, 696.0, 696.0, 0.029881966233378156, 0.024911365730365058, 0.019162589023357737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 226.36363636363637, 145, 445, 151.0, 443.2, 445.0, 445.0, 0.05930270797729246, 0.0459248510019462, 0.021080259476303178], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 185.64705882352942, 141, 511, 148.0, 434.19999999999993, 511.0, 511.0, 0.10000764764364334, 0.08115854999205822, 0.03554959349832634], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6cbfc23-fc48-46f1-aa86-e9a806b2c177", 3, 0, 0.0, 355.6666666666667, 235, 518, 314.0, 518.0, 518.0, 518.0, 0.026142879551039614, 0.0262194700184743, 0.01676480231625913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 389.81818181818187, 283, 852, 288.0, 797.6000000000001, 852.0, 852.0, 0.06000698263070612, 0.09299910296379942, 0.13495711035011346], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1dca9b92-c4f8-4f2d-8463-29fa5951a093", 1, 0, 0.0, 599.0, 599, 599, 599.0, 599.0, 599.0, 599.0, 1.669449081803005, 0.3016094532554257, 1.1510068864774625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 522.25, 280, 1944, 296.5, 1191.5000000000007, 1944.0, 1944.0, 0.12729833159624152, 9.70327336968629, 0.28426127684204666], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5855cf6a-670b-44d8-8b15-bc72f9497e47", 3, 0, 0.0, 435.3333333333333, 309, 509, 488.0, 509.0, 509.0, 509.0, 0.061855670103092786, 0.027988079896907218, 0.03966655927835051], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 148.85714285714283, 142, 174, 147.5, 162.5, 174.0, 174.0, 0.0686294694942008, 0.05690080039118798, 0.024395631734266694], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 165.5625, 142, 437, 147.0, 242.4000000000002, 437.0, 437.0, 0.103935248340284, 0.08069191643606033, 0.03694573280846033], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5fa596b6-a1c8-40a5-bd0a-57d68919472f", 1, 0, 0.0, 290.0, 290, 290, 290.0, 290.0, 290.0, 290.0, 3.4482758620689653, 0.6229795258620691, 2.3774245689655173], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da41a890-a762-4524-8e66-b43f76893223", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 160.56250000000003, 140, 410, 144.0, 233.6000000000002, 410.0, 410.0, 0.11169596358711587, 0.0830084260642531, 0.05606613797243902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 211.6875, 136, 431, 143.0, 428.9, 431.0, 431.0, 0.11169518384329166, 0.04037224601562336, 0.06311486889777795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 283.5, 138, 1283, 143.5, 687.3000000000006, 1283.0, 1283.0, 0.11148505055150261, 6.297823439470585, 0.06494221938864386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 352.8125, 138, 1152, 411.5, 738.3000000000004, 1152.0, 1152.0, 0.11148738102206057, 2.0769832342140835, 0.06505245132879021], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5030c38-d699-4f7d-8888-79ebc6dd66c9", 3, 0, 0.0, 411.0, 265, 525, 443.0, 525.0, 525.0, 525.0, 0.05261680931668304, 0.034444141775992705, 0.03374189920373229], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 31.25, 0.4], "isController": false}, {"data": ["401/Unauthorized", 11, 68.75, 0.88], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1250, 16, "401/Unauthorized", 11, "406/Not Acceptable", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
