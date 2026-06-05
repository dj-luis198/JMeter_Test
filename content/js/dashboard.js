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

    var data = {"OkPercent": 98.05389221556887, "KoPercent": 1.9461077844311376};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7761966364812419, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.03571428571428571, 500, 1500, "see books"], "isController": true}, {"data": [0.625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab088a34-2ef2-4ed4-a486-bde04e86cc66"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/998c32a1-27ff-4cdf-90f7-4cfe809441f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6cd5521a-3f65-4f64-8e54-f5dbb427662c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70110ca7-6357-45d9-8642-82b8047e0081"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6006fd8c-e4f3-45d1-8be7-eecc9927bd65"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/21974037-dfad-478a-993a-3e2234a992b1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/daf4015b-8bed-485f-bea4-5f512d49043e"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4b69e489-92a7-4ccb-bf6a-4e06783726b3"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a3d8c7cb-ee37-4e98-9043-112a6f1e0509"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=998c32a1-27ff-4cdf-90f7-4cfe809441f4"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/10171f97-1e88-4a56-9475-678be8740b64"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ffc43ab9-2599-4e4a-8bae-63d6c7823873"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/35ddb130-91f8-470d-9eff-d7956341e2f4"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f7ac46cf-14d0-449c-9591-10876ceadbe2"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "register"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45c741c8-7956-42d6-94b9-68a4b3d45ecb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4c419e72-ebf5-4c3d-9261-b5b63ea69041"], "isController": false}, {"data": [0.2890625, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9239130434782609, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/70110ca7-6357-45d9-8642-82b8047e0081"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=daf4015b-8bed-485f-bea4-5f512d49043e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=21974037-dfad-478a-993a-3e2234a992b1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/95a1865a-6911-4398-ab94-234e2be2c5d7"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/45c741c8-7956-42d6-94b9-68a4b3d45ecb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ab088a34-2ef2-4ed4-a486-bde04e86cc66"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b69e489-92a7-4ccb-bf6a-4e06783726b3"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35ddb130-91f8-470d-9eff-d7956341e2f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ffc43ab9-2599-4e4a-8bae-63d6c7823873"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=10171f97-1e88-4a56-9475-678be8740b64"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1336, 26, 1.9461077844311376, 383.0980538922154, 109, 2353, 127.0, 1096.4999999999989, 1354.1499999999999, 1810.5599999999986, 5.334845405284532, 720.0154261849167, 3.9069363222709828], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1916.8214285714287, 1347, 2428, 1911.5, 2318.9, 2397.8, 2428.0, 0.2513521398595121, 302.4611812077807, 1.2358965080006286], "isController": true}, {"data": ["deleteBook", 12, 2, 16.666666666666668, 544.4166666666667, 123, 1224, 482.0, 1191.0, 1224.0, 1224.0, 0.06478747010328202, 0.012938513316524583, 0.04351853664001382], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 2, 16.666666666666668, 544.4166666666667, 123, 1224, 482.0, 1191.0, 1224.0, 1224.0, 0.06569510899913501, 0.013119775185862412, 0.04412820879548018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 184.84615384615384, 112, 347, 116.0, 345.4, 347.0, 347.0, 0.1120873246480027, 0.05589210193911072, 0.06247655866047025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 150.15384615384616, 111, 342, 116.0, 342.0, 342.0, 342.0, 0.11208345906798294, 0.08329639878001466, 0.05626064253998362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 284.15384615384613, 113, 903, 116.0, 885.8, 903.0, 903.0, 0.1120863582280009, 5.095887723957166, 0.06452206754065286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 281.53846153846155, 110, 1242, 114.0, 1122.3999999999999, 1242.0, 1242.0, 0.11208539182466397, 15.541660065483734, 0.06441205284395127], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab088a34-2ef2-4ed4-a486-bde04e86cc66", 1, 0, 0.0, 927.0, 927, 927, 927.0, 927.0, 927.0, 927.0, 1.0787486515641855, 0.19489111380798274, 0.7437466289104638], "isController": false}, {"data": ["goToProfile", 12, 2, 16.666666666666668, 324.0833333333333, 115, 927, 222.0, 812.4000000000004, 927.0, 927.0, 0.0641543125063486, 0.12882027236178756, 0.04146431884158696], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 134.87499999999997, 115, 402, 116.0, 209.5000000000002, 402.0, 402.0, 0.09690626741284493, 0.0720172553722412, 0.048642403759963176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 845.2, 682, 910, 869.0, 910.0, 910.0, 910.0, 0.025296346701609355, 7.437965848034726, 0.014426822728261584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 156.8125, 111, 343, 115.0, 340.2, 343.0, 343.0, 0.09690802822446322, 0.04412438296841404, 0.05425051482389995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1104.0, 1012, 1244, 1016.0, 1244.0, 1244.0, 1244.0, 0.025225897915836317, 22.698307287068197, 0.014362010239191965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/998c32a1-27ff-4cdf-90f7-4cfe809441f4", 3, 0, 0.0, 531.6666666666666, 465, 585, 545.0, 585.0, 585.0, 585.0, 0.021712226154547626, 0.025663116265352354, 0.013923530444159773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6cd5521a-3f65-4f64-8e54-f5dbb427662c", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 1.4449589932126696, 2.699908088235294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 296.8, 116, 344, 341.0, 344.0, 344.0, 344.0, 0.025339806809312887, 0.04483958001804194, 0.014030928184453522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 128.44444444444443, 113, 344, 116.0, 142.40000000000032, 344.0, 344.0, 0.08855957845640654, 0.06581429609895058, 0.04445275715487595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 177.72222222222223, 111, 343, 115.0, 341.2, 343.0, 343.0, 0.08856088560885608, 0.031086638991389914, 0.05009417281672817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 209.16666666666666, 113, 1359, 115.0, 444.60000000000144, 1359.0, 1359.0, 0.08846686915750052, 4.444889018619818, 0.05158647513589494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 228.11111111111111, 113, 790, 116.5, 387.7000000000006, 790.0, 790.0, 0.08846078238647533, 1.467540959185178, 0.05166931332317673], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70110ca7-6357-45d9-8642-82b8047e0081", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 0.32203932709447414, 1.2289717023172904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 162.4, 115, 342, 117.0, 342.0, 342.0, 342.0, 0.02536873455678284, 0.018853131833702873, 0.01424513903334974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 674.5294117647057, 109, 1466, 117.0, 1387.6, 1466.0, 1466.0, 0.09004237288135594, 38.14004154528602, 0.049293647378177964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 264.62499999999994, 111, 1239, 115.5, 1033.2000000000003, 1239.0, 1239.0, 0.09677673003526302, 10.90780778402458, 0.05585453852621137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 472.8235294117647, 115, 1024, 343.0, 986.4, 1024.0, 1024.0, 0.08993091189944666, 12.456443847403113, 0.049320451281250996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 235.37500000000003, 112, 906, 116.0, 746.4000000000002, 906.0, 906.0, 0.09690861517588914, 3.584648728982944, 0.056025293148560903], "isController": false}, {"data": ["deleteBooks", 12, 2, 16.666666666666668, 444.16666666666663, 117, 927, 428.0, 887.1000000000001, 927.0, 927.0, 0.065727493810661, 0.013126242660429858, 0.04453508410380562], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6006fd8c-e4f3-45d1-8be7-eecc9927bd65", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.7392035590277778, 1.3812029803240742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/21974037-dfad-478a-993a-3e2234a992b1", 3, 0, 0.0, 347.66666666666663, 209, 611, 223.0, 611.0, 611.0, 611.0, 0.07418397626112759, 0.03356631738377844, 0.04757240665182987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/daf4015b-8bed-485f-bea4-5f512d49043e", 3, 0, 0.0, 546.3333333333334, 414, 694, 531.0, 694.0, 694.0, 694.0, 0.08223909646646016, 0.03721104950793607, 0.05273796225225472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 402.33333333333337, 227, 1474, 240.5, 763.9000000000011, 1474.0, 1474.0, 0.08840994710138166, 6.005463420077407, 0.1975793479275235], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b69e489-92a7-4ccb-bf6a-4e06783726b3", 3, 0, 0.0, 456.6666666666667, 226, 702, 442.0, 702.0, 702.0, 702.0, 0.02238889510802642, 0.026594100992574348, 0.01435746203216538], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 510.52380952380946, 120, 947, 447.0, 850.2, 937.3999999999999, 947.0, 0.09718083038705737, 0.05969408429048738, 0.0439401606144605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 130.41176470588235, 111, 345, 116.0, 168.19999999999985, 345.0, 345.0, 0.09003760394046925, 0.06691271152216514, 0.045194656665430856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 210.41176470588232, 114, 355, 117.0, 354.2, 355.0, 355.0, 0.08993138764131131, 0.08762730912062974, 0.04773472092174383], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3d8c7cb-ee37-4e98-9043-112a6f1e0509", 1, 0, 0.0, 548.0, 548, 548, 548.0, 548.0, 548.0, 548.0, 1.8248175182481752, 0.5827298129562043, 1.0888315465328466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=998c32a1-27ff-4cdf-90f7-4cfe809441f4", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["login", 21, 0, 0.0, 2672.571428571429, 1493, 4441, 2826.0, 3725.6000000000004, 4383.4, 4441.0, 0.09208506906380179, 26.356571852389827, 0.17529307580574435], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/10171f97-1e88-4a56-9475-678be8740b64", 3, 0, 0.0, 365.0, 217, 473, 405.0, 473.0, 473.0, 473.0, 0.018426499763526585, 0.025402417479991894, 0.0118164728301261], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 147.5625, 116, 342, 119.0, 342.0, 342.0, 342.0, 0.09531184845416095, 0.07716164293798773, 0.033880383630190025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ffc43ab9-2599-4e4a-8bae-63d6c7823873", 3, 0, 0.0, 336.0, 218, 469, 321.0, 469.0, 469.0, 469.0, 0.0280224553275358, 0.028104552364628187, 0.01797012923022315], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35ddb130-91f8-470d-9eff-d7956341e2f4", 3, 0, 0.0, 401.3333333333333, 210, 519, 475.0, 519.0, 519.0, 519.0, 0.04911752185729723, 0.03157783387635482, 0.03149788999312354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 833.764705882353, 231, 1583, 687.0, 1506.1999999999998, 1583.0, 1583.0, 0.08987385939499032, 50.67156651293391, 0.19130720702443513], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7ac46cf-14d0-449c-9591-10876ceadbe2", 1, 0, 0.0, 284.0, 284, 284, 284.0, 284.0, 284.0, 284.0, 3.5211267605633805, 1.1244223151408452, 2.1009848151408455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 755.4444444444445, 114, 1360, 1133.0, 1360.0, 1360.0, 1360.0, 0.04537937154612561, 30.166232673903835, 0.07021098729125488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 503.61538461538464, 229, 1358, 458.0, 1238.3999999999999, 1358.0, 1358.0, 0.1119724375538329, 20.75575507375108, 0.24742106750645995], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 1110.6190476190475, 248, 2353, 1024.0, 1656.6, 2283.999999999999, 2353.0, 0.09000707198422733, 0.028428572959303944, 0.04060865943038382], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 437.49999999999994, 230, 1356, 236.0, 1149.5000000000002, 1356.0, 1356.0, 0.09670712247957061, 14.59305992290629, 0.2144036570402785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 137.00000000000003, 116, 329, 118.0, 213.7999999999999, 329.0, 329.0, 0.11535434139456613, 0.08955732559441412, 0.041004863542599676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 321.11111111111114, 230, 690, 234.5, 482.1000000000003, 690.0, 690.0, 0.09068284179874454, 0.14054069329551522, 0.20394783658448115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 115.91666666666667, 115, 118, 115.5, 118.0, 118.0, 118.0, 0.0637551801083838, 0.0473805586547657, 0.03200211189034109], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 114.41666666666666, 109, 117, 115.0, 116.7, 117.0, 117.0, 0.06375551883709933, 0.01705958218883322, 0.036360569336783215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 114.25, 110, 119, 114.5, 118.10000000000001, 119.0, 119.0, 0.06375619630532843, 0.01718428728542055, 0.037481670093562215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 114.66666666666666, 111, 119, 115.0, 118.10000000000001, 119.0, 119.0, 0.06375653504484209, 0.017184378586305095, 0.03754413147660135], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 126.5, 117, 136, 126.5, 136.0, 136.0, 136.0, 0.3572704537334762, 0.10536687209717757, 0.22085175509110397], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1321.1071428571427, 880, 1933, 1249.5, 1833.0, 1923.2, 1933.0, 0.2479982994402324, 296.69218428930776, 0.4896997670587402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 1110.6190476190475, 248, 2353, 1024.0, 1656.6, 2283.999999999999, 2353.0, 0.09200559043492357, 0.029059801443173404, 0.04151033474700653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 190.55555555555554, 113, 343, 116.0, 343.0, 343.0, 343.0, 0.04021214138588911, 0.010838428732915425, 0.023679610601260875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 140.22222222222223, 111, 344, 115.0, 344.0, 344.0, 344.0, 0.04021232105517131, 0.01083847715940164, 0.023640446557825316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 214.35294117647058, 110, 1012, 115.0, 569.5999999999996, 1012.0, 1012.0, 0.10779073380127192, 5.732655252341278, 0.06282426385269445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 209.11764705882354, 111, 684, 117.0, 505.59999999999985, 684.0, 684.0, 0.1077900503442941, 1.891688138814563, 0.06292912923075948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 165.55555555555554, 111, 343, 116.0, 343.0, 343.0, 343.0, 0.040211961718212445, 0.010759841319131064, 0.022933384417418035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 156.0, 115, 346, 116.0, 343.6, 346.0, 346.0, 0.10763444808853882, 0.07999005370642387, 0.05402744757569234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 192.44444444444446, 115, 348, 117.0, 348.0, 348.0, 348.0, 0.0402098058313154, 0.029882482653936542, 0.020183437692671988], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 208.35294117647058, 114, 344, 116.0, 343.2, 344.0, 344.0, 0.1077900503442941, 0.038365530327047696, 0.06094150249819293], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 120.11111111111111, 116, 134, 118.0, 134.0, 134.0, 134.0, 0.04203544989607903, 0.03308649669554658, 0.014942288830246842], "isController": false}, {"data": ["deleteAccount", 12, 2, 16.666666666666668, 434.58333333333337, 114, 611, 471.0, 610.4, 611.0, 611.0, 0.06440290457099615, 0.012568210055440168, 0.043826260418511544], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1459.5714285714287, 794, 2238, 1404.0, 1948.2, 2210.4999999999995, 2238.0, 0.09341761678314213, 0.04835091493658723, 0.04296845459458978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 385.0, 231, 693, 234.0, 693.0, 693.0, 693.0, 0.04018879804235899, 0.06228478759103879, 0.09038554872221949], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45c741c8-7956-42d6-94b9-68a4b3d45ecb", 1, 0, 0.0, 794.0, 794, 794, 794.0, 794.0, 794.0, 794.0, 1.2594458438287153, 0.22753660264483627, 0.8683288727959697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c419e72-ebf5-4c3d-9261-b5b63ea69041", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 1.1570142663043477, 2.1618829257246377], "isController": false}, {"data": ["addBook", 64, 13, 20.3125, 1070.2656250000002, 587, 2068, 911.0, 1943.0, 2042.75, 2068.0, 0.31008503112963004, 82.30369577297172, 1.1305593491848154], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 204.41071428571425, 114, 468, 117.0, 460.6, 466.0, 468.0, 0.24937433759941577, 0.1853260458136283, 0.12054716514815507], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 714.5535714285713, 546, 1023, 676.0, 918.1, 993.6999999999999, 1023.0, 0.24916906566049823, 73.26397849581974, 0.12531452032730137], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 186.05357142857144, 110, 463, 117.0, 346.3, 370.5999999999999, 463.0, 0.24954991889627634, 0.4415863799219265, 0.12136314415072816], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1115.1964285714284, 764, 1585, 1124.0, 1392.1000000000001, 1467.2, 1585.0, 0.24854975655439024, 223.64550785150928, 0.12476032702046541], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 122.0, 115, 133, 120.5, 133.0, 133.0, 133.0, 0.08889635179249616, 0.06641182531373004, 0.03159987505123887], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 13, 7.065217391304348, 172.1684782608696, 111, 622, 122.0, 307.5, 347.75, 615.2, 0.7987636527809131, 1.6090202162630884, 0.3870452826277588], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70110ca7-6357-45d9-8642-82b8047e0081", 3, 0, 0.0, 586.3333333333334, 223, 927, 609.0, 927.0, 927.0, 927.0, 0.05920429428481213, 0.0380626566446953, 0.03796629548863278], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 120.08333333333333, 115, 133, 119.5, 131.5, 133.0, 133.0, 0.06356167866393352, 0.04922305779345632, 0.022594190462570114], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=daf4015b-8bed-485f-bea4-5f512d49043e", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 0.725558483935743, 2.7688880522088355], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=21974037-dfad-478a-993a-3e2234a992b1", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 0.8249500570776256, 3.148187785388128], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 119.84615384615384, 116, 130, 118.0, 127.6, 130.0, 130.0, 0.11444669425125452, 0.09287617472928955, 0.04068222334712562], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95a1865a-6911-4398-ab94-234e2be2c5d7", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 1.5653722426470589, 2.924900428921569], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45c741c8-7956-42d6-94b9-68a4b3d45ecb", 3, 0, 0.0, 1004.3333333333333, 282, 2242, 489.0, 2242.0, 2242.0, 2242.0, 0.016975142732658474, 0.023401604646096565, 0.010885752338325911], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 232.16666666666666, 230, 236, 231.5, 235.7, 236.0, 236.0, 0.0637159119870869, 0.09874721906592472, 0.14329857940064564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab088a34-2ef2-4ed4-a486-bde04e86cc66", 3, 0, 0.0, 455.3333333333333, 293, 580, 493.0, 580.0, 580.0, 580.0, 0.02245055265777126, 0.026930431817671577, 0.014397001541604615], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b69e489-92a7-4ccb-bf6a-4e06783726b3", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 445.58823529411757, 230, 1128, 457.0, 867.9999999999998, 1128.0, 1128.0, 0.1075547738502711, 7.725877876299356, 0.24027444854453084], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35ddb130-91f8-470d-9eff-d7956341e2f4", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 0.32669812386980107, 1.246750678119349], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ffc43ab9-2599-4e4a-8bae-63d6c7823873", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 132.22222222222223, 116, 358, 118.0, 149.20000000000033, 358.0, 358.0, 0.08983694594311326, 0.07448395225166324, 0.03193422687821604], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=10171f97-1e88-4a56-9475-678be8740b64", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 133.1176470588235, 116, 336, 118.0, 179.99999999999986, 336.0, 336.0, 0.08942802884843001, 0.06942898724072447, 0.031788869629715354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 127.94444444444444, 112, 348, 115.0, 140.10000000000034, 348.0, 348.0, 0.09083935564617061, 0.06750854457689047, 0.04559709843958174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 165.94444444444443, 111, 343, 116.5, 342.1, 343.0, 343.0, 0.09073632527964431, 0.024279055787717326, 0.05174806051104715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 128.33333333333331, 112, 342, 116.0, 144.0000000000003, 342.0, 342.0, 0.09084118941397339, 0.024484539334235018, 0.0534046836203242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 190.66666666666663, 113, 343, 116.0, 342.1, 343.0, 343.0, 0.09073724007561437, 0.024456521739130436, 0.05343218336483932], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 19.23076923076923, 0.37425149700598803], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.6923076923076925, 0.1497005988023952], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.6923076923076925, 0.1497005988023952], "isController": false}, {"data": ["401/Unauthorized", 17, 65.38461538461539, 1.2724550898203593], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1336, 26, "401/Unauthorized", 17, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
