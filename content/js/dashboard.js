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

    var data = {"OkPercent": 99.1492652745553, "KoPercent": 0.8507347254447022};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7581503659347971, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=40e5d08f-c275-4e98-b53b-5aa129b96528"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/87f2658c-1dc1-472b-861d-e469a6a5ede9"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2103fd20-1131-439a-bbfb-3ca8c7f2d953"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=04f98a02-5294-4fee-8384-5d1dcbca54a4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/69570320-0f52-4f63-b075-20e50a6864dc"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7e99b2df-aff7-4ec5-a870-bb2c238a4071"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d8e3bca9-a80a-4bce-965a-5104826543c0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=007f6316-e73a-4ef5-b936-a3f4a2b72e4d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ef2c1c5e-2122-4f29-8d79-70839c87d246"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ee8c1e1-36bb-47ed-93d1-47757f30b045"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=659396b8-b2be-47fc-98a0-ef553d7ed829"], "isController": false}, {"data": [0.5294117647058824, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/40e5d08f-c275-4e98-b53b-5aa129b96528"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/97c322b9-e95f-4019-b8ea-5814c84e8b3d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0241116a-87a5-4b22-b702-12ffb0c2fc2a"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ccfa311b-2dde-424c-bafd-35250b6acca0"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "register"], "isController": true}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.16981132075471697, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87f2658c-1dc1-472b-861d-e469a6a5ede9"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0241116a-87a5-4b22-b702-12ffb0c2fc2a"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2ee8c1e1-36bb-47ed-93d1-47757f30b045"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c4e0d97f-905c-4ad5-88f5-07316f2fa589"], "isController": false}, {"data": [0.3467741935483871, 500, 1500, "addBook"], "isController": true}, {"data": [0.9056603773584906, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69570320-0f52-4f63-b075-20e50a6864dc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.2641509433962264, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9717514124293786, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/659396b8-b2be-47fc-98a0-ef553d7ed829"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/04f98a02-5294-4fee-8384-5d1dcbca54a4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c4e0d97f-905c-4ad5-88f5-07316f2fa589"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ccfa311b-2dde-424c-bafd-35250b6acca0"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=97c322b9-e95f-4019-b8ea-5814c84e8b3d"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ef2c1c5e-2122-4f29-8d79-70839c87d246"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/007f6316-e73a-4ef5-b936-a3f4a2b72e4d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e99b2df-aff7-4ec5-a870-bb2c238a4071"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1293, 11, 0.8507347254447022, 468.3310131477187, 136, 2620, 161.0, 1320.4000000000005, 1624.0, 2125.6999999999975, 5.108773815262314, 702.8700960969541, 3.738335917188871], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 2440.943396226415, 1712, 3220, 2408.0, 2906.8, 3044.5999999999995, 3220.0, 0.2341961768578827, 281.81685727786714, 1.1515407719525774], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=40e5d08f-c275-4e98-b53b-5aa129b96528", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 550.4615384615386, 414, 954, 491.0, 914.4, 954.0, 954.0, 0.07625483191675318, 0.013776507719335293, 0.051829456068418184], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 550.4615384615386, 414, 954, 491.0, 914.4, 954.0, 954.0, 0.07668033149497154, 0.013853380201728258, 0.05211866281298847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 197.0, 137, 448, 144.0, 444.8, 448.0, 448.0, 0.11404879946866676, 0.0405931963182364, 0.06448002552680482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 146.41176470588235, 139, 165, 145.0, 154.6, 165.0, 165.0, 0.1140327341024953, 0.08474502993359269, 0.057239087235041584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 218.76470588235293, 136, 1138, 143.0, 566.7999999999995, 1138.0, 1138.0, 0.11404573904993191, 2.0014738944271886, 0.06658127561836272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 295.47058823529414, 137, 1536, 146.0, 662.3999999999992, 1536.0, 1536.0, 0.11405415559670451, 6.065764013985053, 0.06647480828838258], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87f2658c-1dc1-472b-861d-e469a6a5ede9", 3, 0, 0.0, 359.3333333333333, 251, 514, 313.0, 514.0, 514.0, 514.0, 0.020209777490349832, 0.027860809788942554, 0.01296004611197564], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 278.46153846153845, 221, 446, 240.0, 419.2, 446.0, 446.0, 0.07605363536377038, 0.19841817579505303, 0.049167486924625], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 163.93333333333334, 140, 427, 145.0, 260.2000000000001, 427.0, 427.0, 0.07304637470842322, 0.05428544057920906, 0.036665856054814004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 163.60000000000002, 138, 443, 144.0, 267.80000000000007, 443.0, 443.0, 0.0730474418785854, 0.01954589753391836, 0.04165986919638074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 1073.3333333333333, 843, 1328, 1115.5, 1328.0, 1328.0, 1328.0, 0.09450307134981888, 27.787040774137658, 0.05389628287919357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1535.0, 1375, 1915, 1474.5, 1915.0, 1915.0, 1915.0, 0.09438414346389806, 84.92701819844267, 0.0537362848041529], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2103fd20-1131-439a-bbfb-3ca8c7f2d953", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 1.247406005859375, 2.330780029296875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 431.5, 407, 454, 429.5, 454.0, 454.0, 454.0, 0.09589413287730346, 0.16968766481804087, 0.05309763021624127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 145.70588235294122, 139, 150, 146.0, 150.0, 150.0, 150.0, 0.07789125464483879, 0.05788598123508039, 0.039097758679147596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 162.4705882352941, 139, 427, 146.0, 211.7999999999998, 427.0, 427.0, 0.07788483124189653, 0.027721416266934227, 0.04403392170741876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 261.94117647058823, 143, 1551, 147.0, 652.5999999999992, 1551.0, 1551.0, 0.07788661541421935, 4.14225879345615, 0.04539508272016714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 202.05882352941177, 137, 820, 144.0, 517.5999999999997, 820.0, 820.0, 0.07788554490101664, 1.3668716268686802, 0.04547051888953539], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 145.16666666666666, 139, 150, 144.5, 150.0, 150.0, 150.0, 0.09630354878577276, 0.07156933654880182, 0.05407669975763607], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 945.7058823529414, 140, 1841, 1317.0, 1733.0, 1841.0, 1841.0, 0.10523904740090506, 55.71419734720219, 0.05654906074150194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 145.20000000000002, 142, 151, 144.0, 149.8, 151.0, 151.0, 0.07304530756944173, 0.019687993055826095, 0.04294265152031634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 698.0588235294118, 143, 1183, 888.0, 1169.4, 1183.0, 1183.0, 0.1052364415225856, 18.21344890770764, 0.05665043046347367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 182.93333333333334, 136, 437, 145.0, 432.8, 437.0, 437.0, 0.07304673042834603, 0.01968837656076514, 0.04301482270341079], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 533.1538461538463, 223, 1051, 441.0, 984.5999999999999, 1051.0, 1051.0, 0.0766857594544693, 0.013854360838942209, 0.05287123649888216], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=04f98a02-5294-4fee-8384-5d1dcbca54a4", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69570320-0f52-4f63-b075-20e50a6864dc", 3, 0, 0.0, 381.0, 223, 693, 227.0, 693.0, 693.0, 693.0, 0.05858917272088118, 0.027196666764315286, 0.03757183276697133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 443.88235294117646, 284, 1698, 297.0, 810.7999999999993, 1698.0, 1698.0, 0.07783455121513469, 5.591013915215281, 0.17388027701087852], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e99b2df-aff7-4ec5-a870-bb2c238a4071", 3, 0, 0.0, 583.3333333333333, 225, 1285, 240.0, 1285.0, 1285.0, 1285.0, 0.04340403368153014, 0.028187189842009318, 0.027833966911658327], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 502.7142857142858, 148, 1569, 418.0, 899.2, 1502.599999999999, 1569.0, 0.09314332095857783, 0.05721401258100142, 0.04211460703498197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 145.7058823529412, 137, 152, 145.0, 150.4, 152.0, 152.0, 0.10523448719853415, 0.07820648902156688, 0.0528227797070767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 278.94117647058823, 138, 592, 145.0, 578.4, 592.0, 592.0, 0.1052403503884607, 0.12114005865601882, 0.05482074318259201], "isController": false}, {"data": ["login", 21, 0, 0.0, 2529.2857142857147, 1500, 4559, 2446.0, 3650.6, 4470.0999999999985, 4559.0, 0.09245195800039623, 31.72706654890048, 0.1832916818001717], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d8e3bca9-a80a-4bce-965a-5104826543c0", 1, 0, 0.0, 1123.0, 1123, 1123, 1123.0, 1123.0, 1123.0, 1123.0, 0.8904719501335707, 0.28435969501335706, 0.5313265249332146], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=007f6316-e73a-4ef5-b936-a3f4a2b72e4d", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ef2c1c5e-2122-4f29-8d79-70839c87d246", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 151.5333333333333, 145, 184, 150.0, 165.4, 184.0, 184.0, 0.07237216662967645, 0.058590357554689235, 0.0257260436066428], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ee8c1e1-36bb-47ed-93d1-47757f30b045", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=659396b8-b2be-47fc-98a0-ef553d7ed829", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1093.0588235294117, 288, 1986, 1466.0, 1881.1999999999998, 1986.0, 1986.0, 0.10514076492998863, 74.05821826797599, 0.22063977962186435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40e5d08f-c275-4e98-b53b-5aa129b96528", 3, 0, 0.0, 388.66666666666663, 235, 676, 255.0, 676.0, 676.0, 676.0, 0.021791081636655506, 0.025756320775617233, 0.01397409857558963], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/97c322b9-e95f-4019-b8ea-5814c84e8b3d", 3, 0, 0.0, 433.0, 359, 530, 410.0, 530.0, 530.0, 530.0, 0.02179488110892355, 0.030046003091240638, 0.013976535086126106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0241116a-87a5-4b22-b702-12ffb0c2fc2a", 1, 0, 0.0, 885.0, 885, 885, 885.0, 885.0, 885.0, 885.0, 1.1299435028248588, 0.2041401836158192, 0.7790430790960452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 513.1764705882352, 284, 1682, 569.0, 827.5999999999992, 1682.0, 1682.0, 0.11391887635781249, 8.183024286499272, 0.25449168099029007], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 0, 0.0, 1680.6666666666667, 1516, 2059, 1624.0, 2059.0, 2059.0, 2059.0, 0.0941752601591562, 112.66635176814052, 0.21235417549559732], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ccfa311b-2dde-424c-bafd-35250b6acca0", 3, 0, 0.0, 374.0, 238, 451, 433.0, 451.0, 451.0, 451.0, 0.02489213408562894, 0.024965060259707933, 0.015962729215068038], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 962.5, 152, 1625, 950.5, 1512.6999999999998, 1620.35, 1625.0, 0.08625894936599672, 0.027001869270641375, 0.038917611920986805], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 350.7333333333333, 288, 871, 296.0, 695.2, 871.0, 871.0, 0.07299341112808883, 0.11312553072292675, 0.16416389241014512], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 181.73684210526315, 143, 449, 151.0, 436.0, 449.0, 449.0, 0.10780264173210476, 0.0836944337666243, 0.03832047030320912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 504.11111111111103, 288, 876, 578.0, 872.4, 876.0, 876.0, 0.09339296647192503, 0.14474085721771976, 0.21004297049301107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 179.33333333333334, 142, 444, 145.0, 444.0, 444.0, 444.0, 0.07200000000000001, 0.0535078125, 0.036140625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 241.77777777777777, 140, 445, 150.0, 445.0, 445.0, 445.0, 0.07183391997701315, 0.031209094573346422, 0.04029745727877148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 383.1111111111111, 143, 1550, 147.0, 1550.0, 1550.0, 1550.0, 0.07119915193899023, 7.135405026759014, 0.0411774609195766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 222.33333333333334, 138, 850, 144.0, 850.0, 850.0, 850.0, 0.07159562789365663, 2.356207763551461, 0.04147667722702178], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1718.716981132075, 1102, 2620, 1694.0, 2301.6, 2452.8999999999996, 2620.0, 0.23572213252920954, 282.0056207775717, 0.4654591327871696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87f2658c-1dc1-472b-861d-e469a6a5ede9", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 962.5, 152, 1625, 950.5, 1512.6999999999998, 1620.35, 1625.0, 0.08842479270415074, 0.027679848994569912, 0.03989477952081801], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 238.33333333333334, 144, 424, 147.0, 424.0, 424.0, 424.0, 0.0291468710833892, 0.007855992596694745, 0.017163635999300476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 147.0, 146, 148, 147.0, 148.0, 148.0, 148.0, 0.029146587906109127, 0.007855916271568475, 0.017135005780739936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0241116a-87a5-4b22-b702-12ffb0c2fc2a", 3, 0, 0.0, 387.0, 221, 593, 347.0, 593.0, 593.0, 593.0, 0.018380663541953866, 0.025339228548233925, 0.011787079159390987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 358.9473684210526, 140, 1709, 148.0, 1500.0, 1709.0, 1709.0, 0.10886255815552448, 10.337276527370339, 0.06301450092246694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 267.7894736842106, 140, 883, 147.0, 852.0, 883.0, 883.0, 0.10886817210339038, 3.395818531081863, 0.06312406710003839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 162.31578947368422, 137, 432, 149.0, 152.0, 432.0, 432.0, 0.10886068696822987, 0.08090135037385052, 0.05464296201334976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 239.0, 143, 426, 148.0, 426.0, 426.0, 426.0, 0.02914800384753651, 0.0077993682170166044, 0.016623470944298165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 235.4736842105263, 136, 444, 148.0, 442.0, 444.0, 444.0, 0.10886318189891767, 0.046340710962522416, 0.061123632764379966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 245.0, 143, 444, 148.0, 444.0, 444.0, 444.0, 0.029063008602650545, 0.021598583541618227, 0.014588267990002325], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 577.4615384615385, 405, 1285, 514.0, 1048.1999999999998, 1285.0, 1285.0, 0.07635739961938773, 0.01379503801717454, 0.051973737826868406], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 239.66666666666666, 145, 420, 154.0, 420.0, 420.0, 420.0, 0.02895529302756544, 0.02279098259786889, 0.010292701818392402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1191.7619047619048, 761, 2019, 1115.0, 1556.6000000000001, 1973.8999999999994, 2019.0, 0.0914395192893843, 0.047327094944700866, 0.04205860701689454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2ee8c1e1-36bb-47ed-93d1-47757f30b045", 3, 0, 0.0, 350.3333333333333, 230, 455, 366.0, 455.0, 455.0, 455.0, 0.027174651485094705, 0.02725426472186744, 0.017426452938032737], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 486.6666666666667, 292, 871, 297.0, 871.0, 871.0, 871.0, 0.029021117699979684, 0.04497706424791773, 0.0652691738897004], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4e0d97f-905c-4ad5-88f5-07316f2fa589", 3, 0, 0.0, 409.6666666666667, 378, 446, 405.0, 446.0, 446.0, 446.0, 0.01693078694297711, 0.02334045660921486, 0.010857308033094044], "isController": false}, {"data": ["addBook", 62, 4, 6.451612903225806, 1344.6290322580646, 745, 2824, 1129.5, 2457.2000000000003, 2537.2, 2824.0, 0.284569451010451, 83.4254735700385, 1.0370953634686262], "isController": true}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 279.73584905660385, 140, 603, 150.0, 585.8, 599.5, 603.0, 0.2368132972900516, 0.175991132068095, 0.11447517788923393], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69570320-0f52-4f63-b075-20e50a6864dc", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 0.8101527466367713, 3.0917180493273544], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 942.0377358490566, 679, 1428, 881.0, 1178.6, 1269.3999999999996, 1428.0, 0.236551173159922, 69.55389914718839, 0.11896860759507795], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 234.73584905660377, 139, 461, 151.0, 444.8, 447.3, 461.0, 0.23730528653493985, 0.41991912031378026, 0.11540823505312504], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1437.4905660377362, 957, 2015, 1432.0, 1772.2, 1866.2999999999997, 2015.0, 0.2363697179172706, 212.68588767560487, 0.11864651856394247], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 153.77777777777774, 145, 170, 153.0, 167.3, 170.0, 170.0, 0.0936714525840311, 0.06997916135428105, 0.033297274160729806], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 4, 2.2598870056497176, 206.4011299435028, 138, 702, 153.0, 343.80000000000007, 410.1999999999999, 561.5999999999998, 0.7591711737987296, 1.5252953851399749, 0.36981782572518], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 149.77777777777777, 146, 152, 150.0, 152.0, 152.0, 152.0, 0.06733099919202801, 0.052142072616482626, 0.023934066119041204], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/659396b8-b2be-47fc-98a0-ef553d7ed829", 3, 0, 0.0, 584.0, 245, 1075, 432.0, 1075.0, 1075.0, 1075.0, 0.027120114989287552, 0.03205505778844502, 0.017391479989875155], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 169.11764705882356, 141, 434, 152.0, 229.99999999999983, 434.0, 434.0, 0.1057963979438159, 0.0858562565344834, 0.0376073133315908], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/04f98a02-5294-4fee-8384-5d1dcbca54a4", 3, 0, 0.0, 634.6666666666666, 313, 1178, 413.0, 1178.0, 1178.0, 1178.0, 0.052565180824222034, 0.033794346395780765, 0.03370879108844967], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c4e0d97f-905c-4ad5-88f5-07316f2fa589", 1, 0, 0.0, 699.0, 699, 699, 699.0, 699.0, 699.0, 699.0, 1.4306151645207439, 0.2584607474964235, 0.9863420958512161], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ccfa311b-2dde-424c-bafd-35250b6acca0", 1, 0, 0.0, 1051.0, 1051, 1051, 1051.0, 1051.0, 1051.0, 1051.0, 0.9514747859181732, 0.17189730019029498, 0.6559972645099905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 564.3333333333334, 288, 1695, 301.0, 1695.0, 1695.0, 1695.0, 0.07111757315232593, 9.55145430498376, 0.15792330019122724], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=97c322b9-e95f-4019-b8ea-5814c84e8b3d", 1, 0, 0.0, 576.0, 576, 576, 576.0, 576.0, 576.0, 576.0, 1.736111111111111, 0.31365288628472227, 1.196967230902778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 554.8947368421052, 282, 1855, 301.0, 1652.0, 1855.0, 1855.0, 0.10876783219985803, 13.84810281529791, 0.24169200706704677], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 168.05882352941177, 145, 435, 152.0, 216.5999999999998, 435.0, 435.0, 0.0808957539246337, 0.06707079597852932, 0.02875591252789714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef2c1c5e-2122-4f29-8d79-70839c87d246", 3, 0, 0.0, 488.0, 240, 614, 610.0, 614.0, 614.0, 614.0, 0.044074220988144036, 0.028622418903433384, 0.028263741974818932], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/007f6316-e73a-4ef5-b936-a3f4a2b72e4d", 3, 0, 0.0, 358.6666666666667, 233, 464, 379.0, 464.0, 464.0, 464.0, 0.01955505726372602, 0.023113415665556372, 0.01254018971664722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 150.00000000000003, 138, 161, 149.0, 157.8, 161.0, 161.0, 0.10655434585033502, 0.0827252978037269, 0.03787674012648627], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e99b2df-aff7-4ec5-a870-bb2c238a4071", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 177.94444444444443, 141, 441, 145.0, 432.0, 441.0, 441.0, 0.09360228389572706, 0.06956185355922685, 0.04698395890859737], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 224.05555555555557, 140, 445, 146.0, 444.1, 445.0, 445.0, 0.09360131041834585, 0.025045663139283948, 0.05338199734796287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 274.2777777777778, 138, 446, 149.5, 442.4, 446.0, 446.0, 0.09346425251964048, 0.025191536811934347, 0.054946757828929264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 257.11111111111114, 139, 443, 149.0, 442.1, 443.0, 443.0, 0.09346425251964048, 0.025191536811934347, 0.05503803151303048], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 63.63636363636363, 0.5413766434648105], "isController": false}, {"data": ["401/Unauthorized", 4, 36.36363636363637, 0.30935808197989173], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1293, 11, "406/Not Acceptable", 7, "401/Unauthorized", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
