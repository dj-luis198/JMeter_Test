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

    var data = {"OkPercent": 97.72209567198178, "KoPercent": 2.277904328018223};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.771548930654569, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.17857142857142858, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b585d70-718f-44ab-a2df-cbef2e5a4ad9"], "isController": false}, {"data": [0.46875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/998925ff-3ced-48cd-a3e2-9eefe7cc681b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=86c17105-8c43-409c-99d0-02a36a01d836"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/154b7e81-415e-4c25-b362-5e40f12c095d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d3b16eaa-bac4-45a1-b285-00860144d4ab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a898e994-b434-4679-9e5e-e5d35b1b4165"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.65625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/77bc58c2-9361-451b-a828-38e3c76ba0c1"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/324fc643-9c8c-451b-a673-f9a0ce4ebeb8"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d00fdb3b-9e7c-43ce-8c09-9aa16749ebb3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=07026198-2393-416e-9995-178b24e79120"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bbdd5cf4-5d60-498c-9b38-6740ba7bef41"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c60a018e-5c2b-45ca-9f1b-8280cdbf43bb"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b7383a7d-9bd3-4833-885d-cea90b081c2c"], "isController": false}, {"data": [0.3, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3b16eaa-bac4-45a1-b285-00860144d4ab"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=998925ff-3ced-48cd-a3e2-9eefe7cc681b"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/daff513d-1c16-4930-b4f2-426332e6f099"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a898e994-b434-4679-9e5e-e5d35b1b4165"], "isController": false}, {"data": [0.2982456140350877, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5089285714285714, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/86c17105-8c43-409c-99d0-02a36a01d836"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/280b7f29-4882-49d6-ba59-423f1dc5f50c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9029411764705882, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=280b7f29-4882-49d6-ba59-423f1dc5f50c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bbdd5cf4-5d60-498c-9b38-6740ba7bef41"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=154b7e81-415e-4c25-b362-5e40f12c095d"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=77bc58c2-9361-451b-a828-38e3c76ba0c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aa225559-7887-4120-8301-9eca125681c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/73037f79-6183-42f2-bcd8-8a80215c40f7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/07026198-2393-416e-9995-178b24e79120"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8b585d70-718f-44ab-a2df-cbef2e5a4ad9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c60a018e-5c2b-45ca-9f1b-8280cdbf43bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b7383a7d-9bd3-4833-885d-cea90b081c2c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d00fdb3b-9e7c-43ce-8c09-9aa16749ebb3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1317, 30, 2.277904328018223, 352.5641609719062, 97, 4641, 120.0, 876.2, 1047.7999999999993, 1647.6999999999978, 5.1096221517833245, 736.6379247894754, 3.725773729965974], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1584.1607142857138, 1247, 2049, 1579.0, 1864.7, 1926.25, 2049.0, 0.24801367618271522, 298.4433370406211, 1.2194813081835656], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b585d70-718f-44ab-a2df-cbef2e5a4ad9", 1, 0, 0.0, 727.0, 727, 727, 727.0, 727.0, 727.0, 727.0, 1.375515818431912, 0.2485062757909216, 0.9483536795048143], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 614.5, 112, 1549, 551.0, 1416.7, 1549.0, 1549.0, 0.09398441033593553, 0.018993065345598296, 0.06303678498422824], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 614.5, 112, 1549, 551.0, 1416.7, 1549.0, 1549.0, 0.09581698954995957, 0.019363406518549568, 0.06426592396023595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/998925ff-3ced-48cd-a3e2-9eefe7cc681b", 3, 0, 0.0, 1072.3333333333333, 218, 1619, 1380.0, 1619.0, 1619.0, 1619.0, 0.02059025394646534, 0.028385327299245026, 0.013204036547700757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 175.1764705882353, 100, 344, 111.0, 341.6, 344.0, 344.0, 0.08841365106772486, 0.0470916459501347, 0.049113051805198725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 121.35294117647061, 101, 329, 109.0, 156.19999999999985, 329.0, 329.0, 0.08840767378608463, 0.06570140600704141, 0.04437650813090576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 250.35294117647058, 99, 875, 112.0, 752.5999999999999, 875.0, 875.0, 0.08840767378608463, 4.606939726118227, 0.050719636839477666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 262.1764705882353, 103, 1004, 111.0, 815.1999999999998, 1004.0, 1004.0, 0.08841043243102686, 14.058188163078244, 0.050634881165977585], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 206.56250000000003, 108, 308, 212.5, 292.6, 308.0, 308.0, 0.09419411051324016, 0.14309065042505092, 0.06087777320707398], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=86c17105-8c43-409c-99d0-02a36a01d836", 1, 0, 0.0, 600.0, 600, 600, 600.0, 600.0, 600.0, 600.0, 1.6666666666666667, 0.30110677083333337, 1.1490885416666667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/154b7e81-415e-4c25-b362-5e40f12c095d", 3, 0, 0.0, 351.3333333333333, 245, 501, 308.0, 501.0, 501.0, 501.0, 0.05198495901852397, 0.03342131968150548, 0.03333670874560294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3b16eaa-bac4-45a1-b285-00860144d4ab", 3, 0, 0.0, 607.3333333333334, 219, 1163, 440.0, 1163.0, 1163.0, 1163.0, 0.03542540001180847, 0.029532698382240066, 0.02271746029403082], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 121.55, 100, 342, 111.0, 119.50000000000001, 330.89999999999986, 342.0, 0.09698286312808527, 0.0720741785551493, 0.04868085121858967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 139.45, 100, 328, 109.0, 317.3, 327.5, 328.0, 0.09698709586689491, 0.04051863243345473, 0.054498413048643876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 607.8571428571428, 511, 766, 531.0, 766.0, 766.0, 766.0, 0.06951409646570472, 20.439452446151403, 0.039644758140597224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 869.0, 748, 991, 941.0, 991.0, 991.0, 991.0, 0.06919799523522376, 62.26447774975533, 0.039396905490366646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 167.57142857142858, 97, 334, 107.0, 334.0, 334.0, 334.0, 0.06965035521681161, 0.12324848012974866, 0.038566163484308774], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a898e994-b434-4679-9e5e-e5d35b1b4165", 3, 0, 0.0, 794.3333333333334, 218, 1674, 491.0, 1674.0, 1674.0, 1674.0, 0.015869321427815747, 0.021877140705338437, 0.010176615629165697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 137.0, 104, 330, 112.0, 330.0, 330.0, 330.0, 0.04951965930474398, 0.03680123118252946, 0.02485654773695157], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 179.88888888888886, 103, 326, 114.0, 326.0, 326.0, 326.0, 0.04952047671712253, 0.013250596309073803, 0.028242146877733944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 110.88888888888889, 103, 130, 110.0, 130.0, 130.0, 130.0, 0.04952020424333128, 0.013347242549960383, 0.029112463822739677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 174.0, 105, 440, 113.0, 440.0, 440.0, 440.0, 0.04952074919391225, 0.013347389431171662, 0.029161144300712], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 135.57142857142858, 99, 310, 108.0, 310.0, 310.0, 310.0, 0.06980385117818928, 0.05187571361972856, 0.03919649846431527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 22, 0, 0.0, 459.40909090909093, 101, 1032, 322.0, 984.0, 1028.3999999999999, 1032.0, 0.10373982053011048, 42.444921007431546, 0.05693533118937705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 193.95, 102, 919, 110.0, 730.0000000000009, 911.6999999999999, 919.0, 0.09698662554433743, 8.750400448684376, 0.05618404909462985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 22, 0, 0.0, 428.59090909090907, 107, 901, 322.0, 858.9999999999999, 899.65, 901.0, 0.10373884218021322, 13.880098675679372, 0.05703610170650395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 183.60000000000002, 103, 792, 110.0, 492.0000000000004, 777.9499999999998, 792.0, 0.09698709586689491, 2.8752695938180426, 0.05627903551182516], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 388.93749999999994, 107, 727, 431.0, 676.6, 727.0, 727.0, 0.09617234083477591, 0.01943521853661762, 0.06502081417399981], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 333.1111111111111, 219, 771, 228.0, 771.0, 771.0, 771.0, 0.04948943400583975, 0.07669895680397235, 0.11130289698774312], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/77bc58c2-9361-451b-a828-38e3c76ba0c1", 3, 0, 0.0, 533.6666666666667, 210, 1113, 278.0, 1113.0, 1113.0, 1113.0, 0.08351660588513682, 0.037789089251412826, 0.05355719843545558], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 444.8750000000001, 134, 864, 476.0, 717.5, 830.25, 864.0, 0.10019287127720863, 0.06154425393883225, 0.04530205019662851], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 22, 0, 0.0, 120.22727272727273, 101, 333, 110.5, 119.4, 301.04999999999956, 333.0, 0.1037393313528552, 0.07709534292922149, 0.05207228155797614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 22, 0, 0.0, 177.6818181818182, 101, 334, 113.5, 330.7, 333.55, 334.0, 0.10373835301218454, 0.09858090648459014, 0.055203097297144364], "isController": false}, {"data": ["login", 24, 0, 0.0, 2393.458333333333, 1311, 4457, 2282.0, 3682.5, 4398.0, 4457.0, 0.10155678081930933, 35.57460558810897, 0.20234494342441], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 111.9, 106, 117, 112.0, 115.0, 116.9, 117.0, 0.09840340475780462, 0.07966447514083987, 0.034979335285000863], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/324fc643-9c8c-451b-a673-f9a0ce4ebeb8", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 1.3361336297071131, 2.496567730125523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 0, 0.0, 594.1363636363635, 214, 1139, 551.0, 1091.1, 1134.6499999999999, 1139.0, 0.10368603867489243, 56.471536856852, 0.22113367427973551], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d00fdb3b-9e7c-43ce-8c09-9aa16749ebb3", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=07026198-2393-416e-9995-178b24e79120", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 0.8988261815920398, 3.4301150497512434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 422.70588235294116, 218, 1109, 227.0, 1005.8, 1109.0, 1109.0, 0.08835621066199591, 18.766548517304823, 0.19472575953857268], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 606.1538461538462, 103, 1255, 848.0, 1193.3999999999999, 1255.0, 1255.0, 0.1233279574992885, 79.4615222701831, 0.1874562719381463], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bbdd5cf4-5d60-498c-9b38-6740ba7bef41", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 0.7923862390350876, 3.0239172149122804], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c60a018e-5c2b-45ca-9f1b-8280cdbf43bb", 1, 0, 0.0, 655.0, 655, 655, 655.0, 655.0, 655.0, 655.0, 1.5267175572519083, 0.2758229961832061, 1.0526001908396947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7383a7d-9bd3-4833-885d-cea90b081c2c", 3, 0, 0.0, 495.0, 250, 930, 305.0, 930.0, 930.0, 930.0, 0.07912853111070083, 0.036679371191939446, 0.05074323121356791], "isController": false}, {"data": ["register", 25, 7, 28.0, 1003.6799999999996, 218, 4641, 796.0, 1856.4000000000005, 3848.099999999998, 4641.0, 0.10258262004218198, 0.03224941117576096, 0.046282393026843824], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 148.0, 105, 378, 114.0, 354.5, 378.0, 378.0, 0.07405800858014927, 0.05749620783322137, 0.02632530773747494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 350.15000000000003, 214, 1025, 223.0, 880.4000000000005, 1018.9999999999999, 1025.0, 0.09693209906460525, 11.731652192482915, 0.21552246401395822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 303.68421052631584, 215, 1057, 226.0, 454.0, 1057.0, 1057.0, 0.12645674846421606, 8.148101755252947, 0.2827012887772964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 141.28571428571428, 100, 339, 110.0, 339.0, 339.0, 339.0, 0.03787776304753659, 0.028149392264819675, 0.019012861529720516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 169.14285714285714, 103, 327, 110.0, 327.0, 327.0, 327.0, 0.03787776304753659, 0.010135260815454126, 0.02160216173804821], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 138.2857142857143, 97, 336, 107.0, 336.0, 336.0, 336.0, 0.03787837793963269, 0.010209406554041624, 0.022268343280916873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 140.57142857142856, 107, 328, 110.0, 328.0, 328.0, 328.0, 0.03787796800935045, 0.010209296065020237, 0.022305092489881172], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 111.0, 107, 114, 112.0, 114.0, 114.0, 114.0, 0.07123183588185013, 0.02100782659796752, 0.04403296104805775], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3b16eaa-bac4-45a1-b285-00860144d4ab", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1035.160714285714, 816, 1595, 892.5, 1401.0, 1460.85, 1595.0, 0.24709552448231278, 295.61215158427945, 0.48791713916331686], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, 28.0, 1003.6799999999996, 218, 4641, 796.0, 1856.4000000000005, 3848.099999999998, 4641.0, 0.10098765930803255, 0.03174799539496274, 0.04556279160186625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 194.2, 108, 320, 113.0, 320.0, 320.0, 320.0, 0.036278151845832364, 0.009778095614697004, 0.021363013245153238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 110.6, 104, 123, 109.0, 123.0, 123.0, 123.0, 0.03633430467041152, 0.009793230555696857, 0.02136059708162865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 141.57142857142858, 105, 337, 110.5, 332.0, 337.0, 337.0, 0.07196130537807957, 0.019395820590185506, 0.042305376794535055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 154.92857142857142, 102, 328, 111.5, 327.0, 328.0, 328.0, 0.0718818672855353, 0.01937440954180444, 0.04232887302068144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 128.0, 106, 307, 112.0, 226.5, 307.0, 307.0, 0.07196278495977795, 0.053480155619522476, 0.03612194479426354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 111.8, 106, 121, 110.0, 121.0, 121.0, 121.0, 0.03633404063599105, 0.009722194467052293, 0.020721757550213646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 178.71428571428572, 103, 446, 109.5, 394.0, 446.0, 446.0, 0.07183723734510096, 0.019222073273982093, 0.04096967442337789], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 111.8, 108, 119, 111.0, 119.0, 119.0, 119.0, 0.03633430467041152, 0.02700234946697575, 0.01823811777401516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 158.4, 107, 346, 114.0, 346.0, 346.0, 346.0, 0.03652060857942137, 0.028745713393567993, 0.01298193508096619], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 617.9999999999999, 103, 1619, 485.0, 1414.6000000000001, 1619.0, 1619.0, 0.09467007478935908, 0.018646260458084825, 0.06442118309488308], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=998925ff-3ced-48cd-a3e2-9eefe7cc681b", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 541.0, 1.8484288354898337, 0.3339446626617375, 1.2744050369685767], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1320.9583333333333, 859, 3307, 1144.5, 2325.5, 3186.5, 3307.0, 0.10153916450190809, 0.05255445037696415, 0.04670404929726436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 307.8, 221, 440, 226.0, 440.0, 440.0, 440.0, 0.03624974625177624, 0.05618002666168837, 0.08152652892367254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/daff513d-1c16-4930-b4f2-426332e6f099", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 1.6128077651515151, 3.013533775252525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a898e994-b434-4679-9e5e-e5d35b1b4165", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["addBook", 57, 11, 19.29824561403509, 1145.8421052631581, 541, 3013, 897.0, 1848.0, 2742.499999999999, 3013.0, 0.2591238884948993, 88.05833544297683, 0.9395727069808885], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 200.89285714285714, 104, 470, 115.0, 437.3, 442.84999999999997, 470.0, 0.24794010475469427, 0.18426017550617416, 0.11985385923200553], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 622.3035714285714, 496, 888, 555.0, 788.1, 866.5, 888.0, 0.2478654798631428, 72.88068098827507, 0.12465890832960798], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86c17105-8c43-409c-99d0-02a36a01d836", 3, 0, 0.0, 333.6666666666667, 236, 479, 286.0, 479.0, 479.0, 479.0, 0.02550586634926033, 0.025580590567080428, 0.0163563010117327], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 170.125, 102, 453, 113.0, 338.6, 359.14999999999986, 453.0, 0.2483304213635114, 0.439428440928401, 0.12077006820217644], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 826.1785714285714, 703, 1121, 770.5, 997.5000000000001, 1017.6, 1121.0, 0.24760245657008695, 222.79312566045743, 0.12428482683303194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/280b7f29-4882-49d6-ba59-423f1dc5f50c", 3, 0, 0.0, 336.3333333333333, 204, 572, 233.0, 572.0, 572.0, 572.0, 0.028669176812369794, 0.02390031309130177, 0.018384856224078285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 129.3684210526316, 109, 364, 116.0, 139.0, 364.0, 364.0, 0.12280565681636031, 0.09174446041456603, 0.04365357332144057], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 11, 6.470588235294118, 217.1764705882353, 101, 2450, 114.0, 321.0, 418.7999999999995, 2242.6799999999976, 0.7226324223914031, 1.6185754125380976, 0.34533012744898], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 113.57142857142857, 111, 117, 113.0, 117.0, 117.0, 117.0, 0.038590881525993714, 0.029885321338000995, 0.01371785241744308], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=280b7f29-4882-49d6-ba59-423f1dc5f50c", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 146.23529411764707, 109, 434, 115.0, 357.99999999999994, 434.0, 434.0, 0.08702507345940023, 0.0706228867624625, 0.03093469408127118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 316.14285714285717, 220, 676, 223.0, 676.0, 676.0, 676.0, 0.03785502606588938, 0.05866789684235004, 0.08513684084935863], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bbdd5cf4-5d60-498c-9b38-6740ba7bef41", 3, 0, 0.0, 329.6666666666667, 209, 447, 333.0, 447.0, 447.0, 447.0, 0.0910691518426325, 0.0403170724303321, 0.058400465211584], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=154b7e81-415e-4c25-b362-5e40f12c095d", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 341.07142857142856, 219, 649, 245.5, 603.5, 649.0, 649.0, 0.07179818555728212, 0.11127316453067064, 0.1614758020883015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=77bc58c2-9361-451b-a828-38e3c76ba0c1", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 0.8562277843601896, 3.267550355450237], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa225559-7887-4120-8301-9eca125681c9", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 1.4192708333333333, 2.6519097222222223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/73037f79-6183-42f2-bcd8-8a80215c40f7", 1, 0, 0.0, 318.0, 318, 318, 318.0, 318.0, 318.0, 318.0, 3.1446540880503147, 1.0042010613207546, 1.876351218553459], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 137.77777777777777, 101, 318, 116.0, 318.0, 318.0, 318.0, 0.05024929232246646, 0.041661766779076195, 0.01786205313025175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/07026198-2393-416e-9995-178b24e79120", 3, 0, 0.0, 347.6666666666667, 221, 443, 379.0, 443.0, 443.0, 443.0, 0.10404383713671361, 0.04707712682943747, 0.06672082003884304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b585d70-718f-44ab-a2df-cbef2e5a4ad9", 3, 0, 0.0, 366.3333333333333, 212, 601, 286.0, 601.0, 601.0, 601.0, 0.04586104104563174, 0.029484230489948787, 0.029409586868455243], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 113.6818181818182, 103, 153, 112.0, 119.4, 148.04999999999993, 153.0, 0.10391229802047072, 0.08067409856081467, 0.0369375746869642], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c60a018e-5c2b-45ca-9f1b-8280cdbf43bb", 3, 0, 0.0, 611.0, 213, 1327, 293.0, 1327.0, 1327.0, 1327.0, 0.028129658974767695, 0.02345053926900393, 0.01803887636077225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 110.26315789473685, 104, 115, 111.0, 115.0, 115.0, 115.0, 0.12655024044545685, 0.09404759079979752, 0.06352228866109845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 133.1578947368421, 103, 343, 110.0, 340.0, 343.0, 343.0, 0.1265544550498558, 0.04386735427920577, 0.07161618781347205], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b7383a7d-9bd3-4833-885d-cea90b081c2c", 1, 0, 0.0, 382.0, 382, 382, 382.0, 382.0, 382.0, 382.0, 2.617801047120419, 0.47294257198952877, 1.804851112565445], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d00fdb3b-9e7c-43ce-8c09-9aa16749ebb3", 3, 0, 0.0, 286.6666666666667, 204, 414, 242.0, 414.0, 414.0, 414.0, 0.051108196051040056, 0.03285764557317842, 0.03277446166033493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 164.73684210526318, 103, 950, 110.0, 344.0, 950.0, 950.0, 0.12655361210651817, 6.025639231036941, 0.07382727679939255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 166.73684210526318, 99, 737, 111.0, 346.0, 737.0, 737.0, 0.12654939755826267, 1.990720369957173, 0.07394840156455018], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 23.333333333333332, 0.5315110098709187], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.0, 0.22779043280182232], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 10.0, 0.22779043280182232], "isController": false}, {"data": ["401/Unauthorized", 17, 56.666666666666664, 1.2908124525436597], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1317, 30, "401/Unauthorized", 17, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
