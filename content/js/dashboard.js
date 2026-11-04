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

    var data = {"OkPercent": 97.5346687211094, "KoPercent": 2.4653312788906008};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7477034120734908, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9d22f913-3b45-4a46-a0ea-bde1d1fe3a8d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c2ceac14-9926-46c7-90e3-84ab716b615b"], "isController": false}, {"data": [0.5588235294117647, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5588235294117647, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/77defc29-0c51-4443-80e3-7785c7ad1638"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6176470588235294, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9a46d3f1-cd82-497f-8f2c-1d232c160dc3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7242a057-79f6-42c0-876f-375f0ca91b4b"], "isController": false}, {"data": [0.8863636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/893fcab2-747d-4d8d-88be-e718696512ba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=48050687-d97c-4ffe-877d-e4ce02d02126"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ba9d7eca-538c-407e-9793-63020f13be54"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60007dc4-a599-4174-a44e-a99030fa3ec8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d61825b1-177a-46f9-841c-655ebee6cebf"], "isController": false}, {"data": [0.6052631578947368, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/43836c6b-f69c-4b5a-bf1e-938428e35243"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bddfc723-ceb4-48ec-bd67-78deb8ea0ea7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9656e620-adee-4b3e-a5d5-075df38c2a59"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "register"], "isController": true}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=43836c6b-f69c-4b5a-bf1e-938428e35243"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.39814814814814814, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9d22f913-3b45-4a46-a0ea-bde1d1fe3a8d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5294117647058824, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2ceac14-9926-46c7-90e3-84ab716b615b"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a175dad-4206-4276-94fa-edaed6f586eb"], "isController": false}, {"data": [0.25, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=77defc29-0c51-4443-80e3-7785c7ad1638"], "isController": false}, {"data": [0.8981481481481481, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9058823529411765, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d61825b1-177a-46f9-841c-655ebee6cebf"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/3a175dad-4206-4276-94fa-edaed6f586eb"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7242a057-79f6-42c0-876f-375f0ca91b4b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=893fcab2-747d-4d8d-88be-e718696512ba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/be3bb8e4-40b3-4606-88d6-5f7a6f825994"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/60007dc4-a599-4174-a44e-a99030fa3ec8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba9d7eca-538c-407e-9793-63020f13be54"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9a46d3f1-cd82-497f-8f2c-1d232c160dc3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/48050687-d97c-4ffe-877d-e4ce02d02126"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9656e620-adee-4b3e-a5d5-075df38c2a59"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bddfc723-ceb4-48ec-bd67-78deb8ea0ea7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1298, 32, 2.4653312788906008, 395.2681047765797, 124, 4429, 144.5, 1000.0, 1172.9999999999973, 1626.02, 5.0747132278773, 714.2166803341179, 3.7052051424966184], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1879.7407407407406, 1501, 2420, 1977.5, 2202.5, 2327.5, 2420.0, 0.24039852733642886, 289.28028291066965, 1.1820376807997257], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9d22f913-3b45-4a46-a0ea-bde1d1fe3a8d", 3, 0, 0.0, 645.0, 254, 890, 791.0, 890.0, 890.0, 890.0, 0.02636180701399812, 0.026439038870484443, 0.016905195253117282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2ceac14-9926-46c7-90e3-84ab716b615b", 3, 0, 0.0, 970.6666666666666, 225, 1907, 780.0, 1907.0, 1907.0, 1907.0, 0.020277394760321196, 0.023967194132397868, 0.013003407447211181], "isController": false}, {"data": ["deleteBook", 17, 3, 17.647058823529413, 544.8823529411766, 126, 1230, 521.0, 1170.0, 1230.0, 1230.0, 0.09490208337985395, 0.019058920237590156, 0.06370236927238014], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 3, 17.647058823529413, 544.8823529411766, 126, 1230, 521.0, 1170.0, 1230.0, 1230.0, 0.09637625289128758, 0.019354973581568326, 0.06469189539491588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 171.52941176470588, 125, 381, 127.0, 381.0, 381.0, 381.0, 0.13342647024197282, 0.059278511078321335, 0.07477646160849534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 170.9411764705882, 125, 382, 127.0, 379.6, 382.0, 382.0, 0.13342961195529324, 0.09916009247849429, 0.0669754106884968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 274.70588235294116, 126, 876, 129.0, 670.3999999999999, 876.0, 876.0, 0.13342856470108075, 4.6473120030767054, 0.07722270159486379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 272.11764705882354, 125, 1122, 126.0, 1115.6, 1122.0, 1122.0, 0.13343065922594521, 14.156572907100866, 0.0770936104374171], "isController": false}, {"data": ["goToProfile", 17, 3, 17.647058823529413, 361.05882352941177, 127, 890, 248.0, 798.8, 890.0, 890.0, 0.09507032407795767, 0.15546138816654084, 0.06144509514022873], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 158.125, 125, 383, 126.0, 380.2, 383.0, 383.0, 0.08838851170319138, 0.06568716543567249, 0.044366889663515985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 157.3125, 125, 377, 126.0, 376.3, 377.0, 377.0, 0.08826709623320167, 0.031904159173157975, 0.04987651226360968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 765.2857142857143, 618, 1001, 624.0, 1001.0, 1001.0, 1001.0, 0.047360017320234905, 13.925417592724148, 0.02701000987794647], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 977.4285714285714, 869, 1120, 873.0, 1120.0, 1120.0, 1120.0, 0.047199708710369104, 42.47038086582808, 0.026872490408344905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 236.42857142857142, 127, 381, 132.0, 381.0, 381.0, 381.0, 0.047436722800121976, 0.08394076339240335, 0.02626623225358317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 167.07692307692307, 126, 380, 127.0, 379.6, 380.0, 380.0, 0.0775147576173156, 0.05760618217458708, 0.03890877481962912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 145.53846153846155, 124, 377, 126.0, 278.19999999999993, 377.0, 377.0, 0.07751568201874687, 0.029697263994561976, 0.043707385008467096], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/77defc29-0c51-4443-80e3-7785c7ad1638", 3, 0, 0.0, 456.3333333333333, 288, 567, 514.0, 567.0, 567.0, 567.0, 0.09006034042808682, 0.04233305064393143, 0.05775353862087599], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 260.61538461538464, 125, 1115, 127.0, 819.7999999999997, 1115.0, 1115.0, 0.07711060626731281, 5.356435667881653, 0.04482285691830428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 222.46153846153845, 125, 867, 127.0, 672.5999999999999, 867.0, 867.0, 0.07722420563023862, 1.7658655831021557, 0.04496430422475808], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 198.2857142857143, 125, 382, 127.0, 382.0, 382.0, 382.0, 0.04751851525004922, 0.03531405283719478, 0.026682760028103807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 637.9473684210525, 125, 1130, 868.0, 1129.0, 1130.0, 1130.0, 0.0928468808334718, 43.98226800191069, 0.05038432194900263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 235.75000000000006, 125, 1124, 126.0, 603.2000000000005, 1124.0, 1124.0, 0.0883899765766562, 4.993175888112101, 0.05148888772263226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 538.1052631578947, 125, 999, 619.0, 997.0, 999.0, 999.0, 0.09295908332558675, 14.39768782627415, 0.05053599014878346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 204.12499999999997, 124, 617, 127.0, 449.70000000000016, 617.0, 617.0, 0.08826660929337063, 1.6443858126596385, 0.05150322173123921], "isController": false}, {"data": ["deleteBooks", 17, 3, 17.647058823529413, 442.3529411764706, 127, 1027, 454.0, 752.5999999999998, 1027.0, 1027.0, 0.09647524842376469, 0.019374854577750535, 0.06530146209657739], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 429.69230769230774, 253, 1243, 257.0, 1050.1999999999998, 1243.0, 1243.0, 0.07705210500423787, 7.201084137935122, 0.1717754897994867], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9a46d3f1-cd82-497f-8f2c-1d232c160dc3", 3, 0, 0.0, 581.3333333333334, 245, 776, 723.0, 776.0, 776.0, 776.0, 0.07546600256584408, 0.034146400900560966, 0.04839453940583101], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7242a057-79f6-42c0-876f-375f0ca91b4b", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 434.9545454545454, 145, 1490, 392.0, 740.7999999999997, 1390.8499999999985, 1490.0, 0.0984533867965058, 0.06047576200683804, 0.04451554500662323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 153.73684210526318, 126, 384, 127.0, 377.0, 384.0, 384.0, 0.09295680933090668, 0.0690821600593945, 0.04665996093367777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 250.36842105263153, 125, 464, 127.0, 384.0, 464.0, 464.0, 0.0928464271228847, 0.09823892623107032, 0.048847452098573586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/893fcab2-747d-4d8d-88be-e718696512ba", 3, 0, 0.0, 362.3333333333333, 221, 496, 370.0, 496.0, 496.0, 496.0, 0.025853154084798345, 0.025928895747156153, 0.016579008316097897], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=48050687-d97c-4ffe-877d-e4ce02d02126", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["login", 22, 0, 0.0, 2639.818181818182, 1318, 5728, 2436.0, 4964.0, 5630.949999999999, 5728.0, 0.09262455898079304, 35.38310369503574, 0.18862057296710144], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ba9d7eca-538c-407e-9793-63020f13be54", 3, 0, 0.0, 325.3333333333333, 226, 470, 280.0, 470.0, 470.0, 470.0, 0.07733154611537867, 0.034990510774862094, 0.04959086778883333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 133.68750000000003, 126, 212, 129.0, 154.60000000000005, 212.0, 212.0, 0.08961778016758525, 0.0725518942958283, 0.03185632029394632], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60007dc4-a599-4174-a44e-a99030fa3ec8", 1, 0, 0.0, 601.0, 601, 601, 601.0, 601.0, 601.0, 601.0, 1.663893510815308, 0.3006057612312812, 1.1471765806988352], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d61825b1-177a-46f9-841c-655ebee6cebf", 1, 0, 0.0, 683.0, 683, 683, 683.0, 683.0, 683.0, 683.0, 1.4641288433382138, 0.26451546486090777, 1.0094482064421668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 851.1578947368422, 254, 1259, 999.0, 1259.0, 1259.0, 1259.0, 0.09278748248025824, 58.49237338018694, 0.19618619792302544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43836c6b-f69c-4b5a-bf1e-938428e35243", 3, 0, 0.0, 353.0, 230, 483, 346.0, 483.0, 483.0, 483.0, 0.03067547393607231, 0.0307653434886194, 0.019671446501973455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 519.8823529411764, 251, 1493, 506.0, 1297.7999999999997, 1493.0, 1493.0, 0.13329256149099492, 18.94277344821976, 0.29576584172292397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 713.7692307692307, 126, 1496, 995.0, 1449.2, 1496.0, 1496.0, 0.08758219251913334, 56.43014351689663, 0.13312335362320796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bddfc723-ceb4-48ec-bd67-78deb8ea0ea7", 3, 0, 0.0, 349.6666666666667, 248, 550, 251.0, 550.0, 550.0, 550.0, 0.026269012197577997, 0.026345972194250587, 0.0168456881605562], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9656e620-adee-4b3e-a5d5-075df38c2a59", 3, 0, 0.0, 391.66666666666663, 221, 648, 306.0, 648.0, 648.0, 648.0, 0.0240737620067888, 0.02430102082781643, 0.015437926807738912], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 824.6249999999998, 140, 1812, 755.5, 1565.0, 1776.5, 1812.0, 0.09677926665510692, 0.030243520829720913, 0.04366408319790957], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 410.9375, 252, 1251, 254.0, 908.7000000000004, 1251.0, 1251.0, 0.08820432531960286, 6.723345626236928, 0.19696310096087588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 11, 0, 0.0, 147.63636363636365, 126, 342, 128.0, 300.40000000000015, 342.0, 342.0, 0.12775100168399048, 0.09918168587770744, 0.04541148887985599], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=43836c6b-f69c-4b5a-bf1e-938428e35243", 1, 0, 0.0, 684.0, 684, 684, 684.0, 684.0, 684.0, 684.0, 1.461988304093567, 0.2641287463450292, 1.0079724049707601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 376.5882352941176, 252, 772, 274.0, 563.1999999999998, 772.0, 772.0, 0.07906608994930468, 0.12253699682572904, 0.17782148940746942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 166.23076923076923, 125, 379, 128.0, 378.2, 379.0, 379.0, 0.06734041616377189, 0.05004497724670938, 0.03380173233220581], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 146.3846153846154, 125, 375, 126.0, 282.5999999999999, 375.0, 375.0, 0.0672550622367999, 0.017995983450081222, 0.03835640268192494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 166.69230769230768, 126, 378, 127.0, 377.2, 378.0, 378.0, 0.06725471429680023, 0.018127247212809436, 0.03953841602214232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 145.92307692307693, 125, 379, 127.0, 278.5999999999999, 379.0, 379.0, 0.0673414626565689, 0.018150628606653337, 0.03965517771671001], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 127.33333333333333, 127, 128, 127.0, 128.0, 128.0, 128.0, 0.028376039272438352, 0.008368714707301154, 0.017541047714310035], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1209.5555555555557, 994, 1896, 1005.0, 1627.0, 1783.5, 1896.0, 0.25095852213314745, 300.23363976995466, 0.4955450505402579], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 824.6249999999998, 140, 1812, 755.5, 1565.0, 1776.5, 1812.0, 0.09484966328369535, 0.029640519776154794, 0.042793500426823484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 168.0, 124, 375, 127.0, 375.0, 375.0, 375.0, 0.02831176920245746, 0.007630906542849863, 0.016671871903400245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 167.83333333333334, 126, 376, 126.0, 376.0, 376.0, 376.0, 0.028278143822639483, 0.007621843452195798, 0.016624455645731416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 11, 0, 0.0, 265.72727272727275, 125, 1112, 127.0, 966.8000000000005, 1112.0, 1112.0, 0.12454287105284015, 10.218143295772336, 0.0722445951224483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 11, 0, 0.0, 239.6363636363636, 125, 624, 126.0, 575.6000000000001, 624.0, 624.0, 0.12454428115305359, 3.3596217887389326, 0.0723670383652997], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9d22f913-3b45-4a46-a0ea-bde1d1fe3a8d", 1, 0, 0.0, 594.0, 594, 594, 594.0, 594.0, 594.0, 594.0, 1.6835016835016834, 0.3041482533670034, 1.1606954966329968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 167.83333333333334, 125, 376, 126.5, 376.0, 376.0, 376.0, 0.028278010547697935, 0.007566577041083236, 0.016127302890483978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 11, 0, 0.0, 149.8181818181818, 125, 382, 127.0, 331.00000000000017, 382.0, 382.0, 0.12454005094820265, 0.09255369020662327, 0.06251326776110953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 172.0, 127, 395, 127.5, 395.0, 395.0, 395.0, 0.02831123484169301, 0.021039892299344123, 0.014210912801396688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 11, 0, 0.0, 217.36363636363637, 125, 382, 126.0, 380.8, 382.0, 382.0, 0.12454287105284015, 0.05033018013427986, 0.07007747840313396], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 128.33333333333334, 126, 130, 128.5, 130.0, 130.0, 130.0, 0.02970149992574625, 0.02337832904311668, 0.010557955051730112], "isController": false}, {"data": ["deleteAccount", 17, 3, 17.647058823529413, 540.1176470588235, 126, 915, 517.0, 870.1999999999999, 915.0, 915.0, 0.09714507760177375, 0.019040613785457954, 0.0661064217182107], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2ceac14-9926-46c7-90e3-84ab716b615b", 1, 0, 0.0, 1027.0, 1027, 1027, 1027.0, 1027.0, 1027.0, 1027.0, 0.9737098344693281, 0.17591437439143137, 0.671327288218111], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1355.7727272727273, 816, 4429, 1021.5, 2917.5999999999995, 4239.099999999998, 4429.0, 0.09536731588689436, 0.04936003654302149, 0.04386524002219457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 382.5, 254, 772, 256.0, 772.0, 772.0, 772.0, 0.02826096172052735, 0.04379897094773135, 0.06355956527575633], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a175dad-4206-4276-94fa-edaed6f586eb", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 0.7622956223628692, 2.9090849156118144], "isController": false}, {"data": ["addBook", 58, 12, 20.689655172413794, 1199.7241379310346, 637, 2790, 999.5, 1942.6000000000001, 2010.45, 2790.0, 0.28825175311734336, 90.34414285172926, 1.0467714483532375], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=77defc29-0c51-4443-80e3-7785c7ad1638", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 0.7720686431623931, 2.946380876068376], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 240.3148148148148, 125, 662, 128.0, 508.5, 513.75, 662.0, 0.2520031920404325, 0.1872797159597355, 0.12181794927735752], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 724.425925925926, 619, 1287, 626.5, 1000.5, 1008.25, 1287.0, 0.2518574486840448, 74.05445236746002, 0.12666658796121394], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 201.77777777777777, 125, 509, 130.0, 381.0, 382.25, 509.0, 0.2524685816876122, 0.44675104493940754, 0.12278257195354578], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 962.3148148148149, 864, 1383, 875.0, 1126.5, 1261.25, 1383.0, 0.2515770151784799, 226.36944048281825, 0.12627986894701043], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 128.64705882352942, 127, 130, 129.0, 130.0, 130.0, 130.0, 0.08009649271593072, 0.05983771184344434, 0.028471800145115998], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 12, 7.0588235294117645, 202.47058823529414, 125, 1288, 130.0, 349.40000000000003, 498.0499999999999, 1204.2199999999991, 0.7687020691650991, 1.6818757927240089, 0.3691916009690168], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 155.84615384615387, 128, 378, 129.0, 312.79999999999995, 378.0, 378.0, 0.06748198750025954, 0.052259000085650216, 0.023987737744232886], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 153.76470588235293, 127, 450, 129.0, 275.59999999999985, 450.0, 450.0, 0.12854345146728569, 0.1043160236028461, 0.04569318001376171], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d61825b1-177a-46f9-841c-655ebee6cebf", 3, 0, 0.0, 664.3333333333334, 315, 915, 763.0, 915.0, 915.0, 915.0, 0.029101632601588948, 0.024260833689019955, 0.01866217976078458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a175dad-4206-4276-94fa-edaed6f586eb", 3, 0, 0.0, 1234.6666666666667, 305, 2821, 578.0, 2821.0, 2821.0, 2821.0, 0.056495047267522885, 0.025562537663364845, 0.036228920285488304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 333.69230769230774, 253, 756, 256.0, 755.2, 756.0, 756.0, 0.06720986020349078, 0.1041621563895897, 0.15115655082874926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7242a057-79f6-42c0-876f-375f0ca91b4b", 3, 0, 0.0, 596.3333333333334, 330, 979, 480.0, 979.0, 979.0, 979.0, 0.059575820160457545, 0.038301511984669155, 0.03820454613154341], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=893fcab2-747d-4d8d-88be-e718696512ba", 1, 0, 0.0, 579.0, 579, 579, 579.0, 579.0, 579.0, 579.0, 1.7271157167530224, 0.31202774179620035, 1.1907653281519863], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be3bb8e4-40b3-4606-88d6-5f7a6f825994", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 1.4515269886363635, 2.712180397727273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 11, 0, 0.0, 481.5454545454545, 252, 1240, 503.0, 1143.8000000000004, 1240.0, 1240.0, 0.12436264146250466, 13.70075751687375, 0.2768018274242236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60007dc4-a599-4174-a44e-a99030fa3ec8", 3, 0, 0.0, 899.3333333333334, 224, 1615, 859.0, 1615.0, 1615.0, 1615.0, 0.04060748802079103, 0.026106702096699966, 0.02604060917999946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 150.38461538461542, 127, 378, 129.0, 290.3999999999999, 378.0, 378.0, 0.07487142272981208, 0.062076013571885205, 0.026614451048487885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba9d7eca-538c-407e-9793-63020f13be54", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 0.6475414426523297, 2.4711581541218637], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9a46d3f1-cd82-497f-8f2c-1d232c160dc3", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 0.7655256885593221, 2.9214115466101696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 133.47368421052633, 128, 201, 129.0, 136.0, 201.0, 201.0, 0.09210424261227022, 0.07150671179370588, 0.03274017999108043], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48050687-d97c-4ffe-877d-e4ce02d02126", 3, 0, 0.0, 337.0, 237, 517, 257.0, 517.0, 517.0, 517.0, 0.02403672812056823, 0.02841059889511173, 0.01541417786377585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9656e620-adee-4b3e-a5d5-075df38c2a59", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.37716923277661796, 1.4393593423799582], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bddfc723-ceb4-48ec-bd67-78deb8ea0ea7", 1, 0, 0.0, 600.0, 600, 600, 600.0, 600.0, 600.0, 600.0, 1.6666666666666667, 0.30110677083333337, 1.1490885416666667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 144.23529411764707, 126, 397, 127.0, 194.59999999999982, 397.0, 397.0, 0.07911245136911077, 0.05879353075380205, 0.039710742191135684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 216.7058823529412, 125, 385, 127.0, 382.6, 385.0, 385.0, 0.07912018355882586, 0.02117083036632645, 0.04512322968589287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 215.47058823529412, 124, 383, 128.0, 379.8, 383.0, 383.0, 0.07912018355882586, 0.021325361974839783, 0.04651401416251286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 155.88235294117646, 124, 382, 126.0, 376.4, 382.0, 382.0, 0.07911981532504282, 0.021325262724327946, 0.04659106312597736], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 25.0, 0.6163328197226502], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.375, 0.23112480739599384], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 9.375, 0.23112480739599384], "isController": false}, {"data": ["401/Unauthorized", 18, 56.25, 1.386748844375963], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1298, 32, "401/Unauthorized", 18, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
